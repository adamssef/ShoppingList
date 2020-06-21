<?php


namespace App\Controller;

use App\Entity\ShoppingList;
use App\Entity\User;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Tests\Compiler\J;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as Response;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\Session;


class DefaultController extends AbstractController
{

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
    public function register(Request $request, Session $session)
    {
        $session->start();
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        //this scenario is accepted in a case where user agent renders the reg form and needs a token to be generated
        if ($request->getMethod() === "GET" && is_null($session->get('regToken'))) {
            $random = random_bytes(10);
            $token = md5($random);

            $session->set('regToken', $token);
            $jsonResponse = new JsonResponse($token);
            $jsonResponse->headers->set('Content-Type', 'application/json');
            $jsonResponse->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $jsonResponse->headers->set('Access-Control-Allow-Methods', 'GET');
            return $jsonResponse;
        } elseif ($request->getMethod() === "POST" && $session->get('regToken') === $request->get('regToken') && $session->get('regToken') !== null && is_string($session->get('regToken'))) {
            $user = new User();
            $regData = $request->request->all();
            if (count($regData) > 0 && filter_var($regData['email'], FILTER_VALIDATE_EMAIL) && ctype_alnum($regData['fName'])) {
                $em = $this->getDoctrine()->getManager();
                $user->setRegDate();
                $user->setFirstName($regData['fName']);
                $user->setEmail(filter_var($regData['email'], FILTER_SANITIZE_EMAIL));
                $user->setPassword($regData['password']);

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
        return new JsonResponse($session->get('regToken') . "oraz" . $request->get('regToken'));
    }


}
