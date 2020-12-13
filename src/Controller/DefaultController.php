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
use Symfony\Component\HttpFoundation\Session\Session as Session;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;




class DefaultController extends AbstractController
{
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }




    /**
     * @Route("/dashboard/application")
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }


    /**
     * @Route("/dashboard")
     */
    public function about(Request $request)
    {
        if ($request->getMethod() === 'GET') {
            return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
        } else {
            return null;
        }
    }


    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, EntityManagerInterface $em, Session $session)
    {
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";

        $session->start();


        /**
         * This case intended for GET requests. listazakupow.com.pl is intended to be SPA so we want redirections whenever
         * user is tempted to send GET requests from pressing enter with url in the browser.
         */
        if (
            $request->getMethod() === "GET" &&
            $request->headers->get('X-Custom-Header') !== 'logTokenRequest'
        ) {
            return $this->redirect($allowedOrigin);
        }


        /**
         * This is a get request with NULL 'logToken' session key. When this request is happeing logToken is send in response.
         */

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


        /**
         * CAUTION: I am not sure if I even need this case... This needs to be tested.
         * TODO: to perform test if the below if is even needed...
         */
        if (
            $request->getMethod() === "GET" &&
            !is_null($session->get('logToken'))
        ) {
            return new JsonResponse($session->get('logToken'));
        }


        /**
         * IF THERE IS ANY NOT POST REQUEST I WANT IT DO BE REDIRECTED.
         * AS FOR NOW THE APP DOES NOT HEADERS DIFFERENT THAN POST/GET
         * IT IS INTENDED TO BE CHANGED ON FURTHER DEVELOPMENT STAGES
         */
        if ($request->getMethod() !== "POST") {
            return $this->redirect($allowedOrigin);
        }


        $em = $this->getDoctrine()->getManager();
        $logData = $request->request->all();


        /**
         * WE CHECK THE POST IF:
         * -it is post..
         * -its count if greater than 0
         * -email key is in the right format
         * -password has been set
         * -logToken from SESSION is the same as the one from POST
         *
         * If the above are met user data (id) and (firstName) are retrieved from the DB and returned in response
         *
         * If something goes wrong than 'Login unsuccesful' mesagge is returned
         */
        if (
            $request->getMethod() === "POST" &&
            count($logData) > 0 &&
            filter_var($logData['email'], FILTER_VALIDATE_EMAIL) !== false &&
            isset($logData['password']) &&
            $session->get('logToken') === $request->get('logToken')
        ) {
            $user = $em->getRepository(User::Class)->findOneBy(['email' => strtolower($logData['email'])]);
            $email = $user === null ? null : $user->getEmail();
            if ($email !== null and $this->passwordEncoder->isPasswordValid($user, $logData['password'])) {
                return new JsonResponse([$user->getId(), $user->getFirstName()]);
            } else {
                return new JsonResponse('false');
            }
        } else {
            return new JsonResponse('false');
        }
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout(Request $request)
    {
        $request->getSession()->invalidate();
        return new JsonResponse('session invalidated');
    }

    /**
     * @Route("/change-password-request")
     */
    public function changePasswordRequest(Request $request, MailerInterface $mailer)
    {
        $email = (new Email())
            ->from('kontakt@listazakupow.com.pl')
            ->to('adam.youssef@gmail.com')
            ->subject('zmiana hasła - listazakupow.com.pl')
            ->text('Sending emails is fun again!')
            ->html('<p>Kilknij, aby zmienić hasło <a href="https://google.com">link</a></p>');

        $mailer->send($email);

        return new JsonResponse('mail sent successfully');
    }


    /**
     * @Route("/dasboard/new-list", name="newList")
     */
    public function newList(Request $request)
    {
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        if (
            $request->getMethod() === "GET"
        ) {
            return $this->redirect($allowedOrigin);
        } else {
            return null;
        }
    }

    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, Session $session)
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
//                    return $response;
                    return new JsonResponse('user already exists');
                }
                $user->setRegDate();
                $user->setFirstName($regData['fName']);
                $user->setEmail(strtolower(filter_var($regData['email'], FILTER_SANITIZE_EMAIL)));
                $user->setPassword($this->passwordEncoder->encodePassword(
                    $user,
                    $regData['password']
                ));

                $em->persist($user);
                $em->flush();

                $user = $em->getRepository(User::Class)->findOneBy(['email' => $regData['email']]);
                $session->invalidate();
                return new JsonResponse(['registration successful', $user->getId(), $user->getFirstName()]);
            }
        }
        return new JsonResponse($request->headers->get('X-Custom-Header'));
    }

    /**
     * @Route("/dashboard/save")
     */
    public function save(Request $request)
    {
        $reqQnt = count($request->request->all());

        if ($request->getMethod() === 'POST' and $reqQnt > 1 and $reqQnt <= 101 and isset($request->request->all()['name'])) {
            $shoppingList = new ShoppingList();
            $postVars = $request->request->all();
            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository(User::Class)->findOneBy(['id' => $postVars['id']]);
            unset($postVars['id']);
            $shoppingList->setCreationDate(new DateTime());
            $shoppingList->setName($postVars['name']);
            unset($postVars['name']);
            $shoppingList->setUser($user);
            $postVars = serialize($postVars);
            $shoppingList->setListItems($postVars);
            $em->persist($shoppingList);
            $em->flush();
            $response = $this->json([]);
            $response->headers->set('Content-Type', 'application/json');

            return new JsonResponse($request->request->all());
        } else {
            return $this->redirect("./../");
        }
    }

    /**
     * @Route("/dashboard/saved", name="saved")
     */

    public function savedWithNoId(Request $request){
        return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
    }


    /**
     * @Route("/dashboard/saved/{id}", name="saved")
     */
    public function saved(int $id, Request $request, EntityManagerInterface $em, Session $session)
    {
        $session->start();
        $allowedOrigin = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        $em = $this->getDoctrine()->getManager();
        $requestData = $request->request->all();

        if ($request->getMethod() !== "GET" ||  $request->headers->get('X-Custom-Header') !== 'savedListsTokenRequest' && $session->get('savedListsToken') !== $request->headers->get('SavedListsToken-Header')) {
            return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
        }
        if (
            $request->getMethod() === "GET" &&
            $request->headers->get('X-Custom-Header') === 'savedListsTokenRequest'
        ) {
            $random = random_bytes(10);
            $token = md5($random);
            $session->set('savedListsToken', $token);
            $jsonResponse = new JsonResponse($token);
            $jsonResponse->headers->set('Content-Type', 'application/json');
            $jsonResponse->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $jsonResponse->headers->set('Access-Control-Allow-Methods', 'GET');
            return $jsonResponse;
        }

        if (
            $request->getMethod() === "GET" &&
            $request->headers->get('X-Custom-Header') !== 'savedListsTokenRequest' &&
            !empty($session->get('savedListsToken')) &&
            $session->get('savedListsToken') === $request->headers->get('SavedListsToken-Header') &&
            $session->get('savedListsToken') !== null &&
            $session->get('savedListsToken') !== '' &&
            $session->get('savedListsToken') !== false &&
            $request->headers->get('SavedListsToken-Header') !== null &&
            $request->headers->get('SavedListsToken-Header') !== '' &&
            $request->headers->get('SavedListsToken-Header') !== false
        ) {
            $em = $this->getDoctrine()->getManager();
            $result = $em->getRepository(User::class)->findOneBy(['id' => $id])->getShoppingLists()->getValues();
            for ($i = count($result) - 1; $i > -1; $i--) {
                $result[$i]->setListItems(unserialize($result[$i]->getListItems()));

            }

            $serializer = $this->get('serializer');
            $result = $serializer->serialize($result, 'json', ['groups' => 'ListDataToBeSerialized']);
            $response = new Response($result);
            $response->headers->set('Content-Type', 'application/json');
            $response->headers->set('Access-Control-Allow-Origin', "http://localhost:" . $request->getPort());
            $response->headers->set('Access-Control-Allow-Methods', 'GET');

            return $response;
        }
        return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
    }

    /**
     * @Route("/dashboard/update-list-items", name="updateList")
     */

    //TODO: TOKEN CSFR TOKEN VALIDATION
    public function updateList(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $data = $request->request->all();
        $uid = $request->request->all()['id'];//to be used to validation and authorization
        unset($data['id']);//currently unset
        $name = $request->request->all()['name'];
        $listId = $request->request->all()['listId'];
        unset($data['listId']);//currently unset
        if ($request->getMethod() === "POST") {
            $listToUpdate = $em->getRepository(ShoppingList::class)->findOneBy(['id' => $listId]);
            $listToUpdate->setName($name);
            unset($data['name']);
            $data = serialize($data);
            $listToUpdate->setListItems($data);
            $em->persist($listToUpdate);
            $em->flush();
            return $this->json('test');
        } else {
            return $this->redirect("https://" . $request->server->get('HTTP_HOST'));
        }
    }

}


