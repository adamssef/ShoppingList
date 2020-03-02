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
     * @Route("/", name="home", defaults={"reactRouting": null})
     * @param $reactRouting
     */
    public function index($reactRouting)
    {

//        phpinfo();
//        var_dump($reactRouting);
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);

    }


    /**
     * @Route("/save", name="save")
     */
    public function save(Request $request)
    {
        $shoppingList = new ShoppingList();
        $list = $request->request->all();

        if (count($list) > 0) {
            $em = $this->getDoctrine()->getManager();
            $shoppingList->setCreationDate(new \DateTime());
            $shoppingList->setName($list['name']);
            unset($list['name']);
            $shoppingList->setListItems($list);

            $em->persist($shoppingList);
            $em->flush();
            $results = $em->getRepository(ShoppingList::class)->listAllShoppingLists();
            $response = $this->json($results);

            $response->headers->set('Access-Control-Allow-Origin', 'https://localhost:8006');
            $response->headers->set('Content-Type', 'application/json');


            return $response;
        } else {
            return new Response();
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
            $response->headers->set('Access-Control-Allow-Origin', 'https://localhost:'.$request->getPort());
            $response->headers->set('Access-Control-Allow-Methods', 'GET,POST');

            return $response;
        } else {
            return $this->redirect("https://localhost:".$request->getPort());
        }
    }
}
