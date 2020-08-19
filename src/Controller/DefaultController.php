<?php


namespace App\Controller;

use App\Entity\ShoppingList;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Tests\Compiler\J;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as Response;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\Session;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class DefaultController extends AbstractController
{
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }


    /**
     * @Route("/")
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }

    /**
     * @Route("/save", name="save")
     */
    public function save(Request $request)
    {
        //number of POST request elements
        $reqQnt = count($request->request->all());
        foreach ($request->request->all() as $key => $value) {
            if ($key !== "name" or is_int($key) === false or $key === 2) {
                return $this->redirect("./..");
            }
        }
        if ($request->getMethod() === 'POST' and $reqQnt > 1 and $reqQnt <= 101 and isset($request->request->all()['name'])) {
            $shoppingList = new ShoppingList();

            $postVars = $request->request->all();

            $em = $this->getDoctrine()->getManager();
            $shoppingList->setCreationDate(new DateTime());
            $shoppingList->setName($postVars['name']);
            unset($postVars['name']);
            $postVars = serialize($postVars);
            $shoppingList->setListItems($postVars);
            $em->persist($shoppingList);
            $em->flush();
            $response = $this->json([]);
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        } else {
            return $this->redirect("./../");
        }
    }

    /**
     * @Route("/saved", name="saved")
     */
    public function saved(Request $request)
    {
        if ($request->getMethod() === "POST") {
            $em = $this->getDoctrine()->getManager();
            $results = $em->getRepository(ShoppingList::class)->listAllShoppingLists();
            $response = $this->json($results);

            $response->headers->set('Content-Type', 'application/json');
            $response->headers->set('Access-Control-Allow-Origin', "http://localhost:" . $request->getPort());
            $response->headers->set('Access-Control-Allow-Methods', 'GET,POST');

            return $response;
        } else {
            return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
        }
    }

    /**
     * @Route("/about", name="about")
     */
    public function about(Request $request)
    {
        return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
    }

    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, Session $session, EntityManagerInterface $em)
    {
        $session->start();
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        $em = $this->getDoctrine()->getManager();
        $regData = $request->request->all();
        if (
            $request->getMethod() === "GET" &&
            $request->headers->get('X-Custom-Header') !== 'regTokenRequest'
        ) {
            return $this->redirect($allowedOrigin);
        }


        //this scenario is accepted in a case where user agent renders the reg-form and needs a token to be generated
        if (
            $request->getMethod() === "GET" &&
            is_null($session->get('regToken')) &&
            $request->headers->get('X-Custom-Header') === 'regTokenRequest'
        ) {
            $random = random_bytes(10);
            $token = md5($random);
            $session->set('regToken', $token);
            $jsonResponse = new JsonResponse($token);
            $jsonResponse->headers->set('Content-Type', 'application/json');
            $jsonResponse->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $jsonResponse->headers->set('Access-Control-Allow-Methods', 'GET');
            return $jsonResponse;
        }

        if (
            $request->getMethod() === "GET" &&
            !is_null($session->get('regToken'))
        ) {
            return new JsonResponse($session->get('regToken'));
        }

        if (
            $request->getMethod() === "POST" &&
            $session->get('regToken') === $request->get('regToken') &&
            $session->get('regToken') !== null &&
            is_string($session->get('regToken'))
        ) {

            $user = new User();
            if (
                count($regData) > 0 &&
                filter_var($regData['email'], FILTER_VALIDATE_EMAIL) !== false &&
                isset($regData['fName']) &&
                isset($regData['password'])
            ) {
                $isUserNew = $em->getRepository(User::class)->findOneBy(['email' => $request->request->all()['email']]) === null;
                if ($isUserNew === false) {
                    $response = $this->json("user already exists");
                    $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
                    $response->headers->set('Content-Type', 'application/json');
                    $response->headers->set('Access-Control-Allow-Methods', 'POST');
                    $session->invalidate();
                    return $response;
                }
                $user->setRegDate();
                $user->setFirstName($regData['fName']);
                $user->setEmail(filter_var($regData['email'], FILTER_SANITIZE_EMAIL));
                $user->setPassword($this->passwordEncoder->encodePassword(
                    $user,
                    $regData['password']
                ));


                $em->persist($user);
                $em->flush();
                $response = $this->json("registration successful");
                $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
                $response->headers->set('Content-Type', 'application/json');
                $response->headers->set('Access-Control-Allow-Methods', 'POST');
                $session->invalidate();
                return $response;
            }
        }
        return new JsonResponse($request->request->all());
    }


    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, Session $session, EntityManagerInterface $em)
    {
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        $session->start();
        if (
            $request->getMethod() === "GET" &&
            is_null($session->get('logToken')) &&
            $request->headers->get('X-Custom-Header') === 'logTokenRequest'
        ) {
            $random = random_bytes(10);
            $token = md5($random);
            $session->set('logToken', $token);
            $jsonResponse = new JsonResponse($token);
            $jsonResponse->headers->set('Content-Type', 'application/json');
            $jsonResponse->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $jsonResponse->headers->set('Access-Control-Allow-Methods', 'GET');
            return $jsonResponse;
        }

        if ($request->getMethod() !== "POST") {
            return $this->redirect($allowedOrigin);
        }


        $em = $this->getDoctrine()->getManager();
        $logData = $request->request->all();
        if (
            $request->getMethod() === "POST" &&
            count($logData) > 0 &&
            filter_var($logData['email'], FILTER_VALIDATE_EMAIL) !== false &&
            isset($logData['password'])
        ) {
            $user = $em->getRepository(User::Class)->findOneBy(['email' => $logData['email']]);
            $email = $user === null ? null : $user->getEmail();
            if ($email !== null AND $this->passwordEncoder->isPasswordValid($user, $logData['password'])) {
                return new JsonResponse('Login successful');
            } else {
                return new JsonResponse('Login unsuccessful');
            }
        }  else {
            return new JsonResponse('Login unsuccessful');
        }


    }
}


