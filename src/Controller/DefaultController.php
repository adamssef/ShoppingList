<?php


namespace App\Controller;

use App\Entity\ShoppingList;
use App\Entity\User;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as Response;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\Routing\Annotation\Route;

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
        foreach ($request->request->all() as $key=>$value) {
            if ($key !== "name" OR is_int($key) === false OR $key === 2) {
                return $this->redirect("./..");
            }
        }
        if ($request->getMethod() === 'POST' AND $reqQnt > 1 AND $reqQnt <= 101 AND isset($request->request->all()['name'])) {
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
    public function register(Request $request)
    {
        if ($request->getMethod() === 'POST') {
            $user = new User();
            $regData = $request->request->all();
        }

        if (count($regData) > 0 && filter_var($regData['email'], FILTER_VALIDATE_EMAIL) && ctype_alnum($regData['fName'])) {
            $em = $this->getDoctrine()->getManager();
            $user->setRegDate();
            $user->setFirstName($regData['fName']);
            $user->setEmail(filter_var($regData['email'], FILTER_SANITIZE_EMAIL));
            $user->setPassword($regData['password']);

            $em->persist($user);
            $em->flush();

            $response = $this->json($regData);
            $response->headers->set('Content-Type', 'application/json');

            return $response;
        } elseif ($request->getMethod() === 'GET') {
            return $this->redirect($request->server->get('HTTP_HOST'));
        }
        return new Response();
    }


}
