<?php


namespace App\Controller;

use App\Entity\ShoppingList;
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
// OLD CODE
//        if ($request->getMethod() !== 'POST') {
//            return $this->redirect("https://".$request->server->get('HTTP_HOST'));
//        }
//        else {
//            $shoppingList = new ShoppingList();
//            $list = $request->request->all();
//        }
//        if (count($list) > 0) {
//            $em = $this->getDoctrine()->getManager();
//            $shoppingList->setCreationDate(new \DateTime());
//            $shoppingList->setName($list['name']);
//            unset($list['name']);
//            $list = serialize($list);
//            $shoppingList->setListItems($list);
//            $em->persist($shoppingList);
//            $em->flush();
//            $response = $this->json([]);
//            $response->headers->set('Content-Type', 'application/json');
//
//            return $response;
//        }
//        return new Response();


    }


    /**
     * @Route("/saved", name="saved")
     */
    public function saved(Request $request)
    {
        if ($request->getMethod() === "POST") {
            $em = $this->getDoctrine()->getManager();
            $results = $em->getRepository(ShoppingList::class)->getLastTenLists();

            $response = $this->json($results);

            $response->headers->set('Content-Type', 'application/json');
            $response->headers->set('Access-Control-Allow-Origin', "http://localhost:" . $request->getPort());
            $response->headers->set('Access-Control-Allow-Methods', 'GET,POST');

            return $response;
        } else {
            return $this->redirect("https://".$request->server->get('HTTP_HOST'));
        }
    }

    /**
     * @Route("/about", name="about")
     */
    public function about(Request $request)
    {
            return $this->redirect("https://".$request->server->get('HTTP_HOST'));
    }

}
