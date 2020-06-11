<?php

namespace App\Controller;

use App\Entity\ShoppingList;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as Response;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class DefaultController extends AbstractController
{

    /**
     * @param Request $request
     * @param int $min
     * @param int $max
     * @return bool
     * Checks whether the number of the request parameters is within the desired range
     */
    private static function reqParamCountValidator(Request $request, int $min, int $max)
    {
        $reqQnt = count($request->request->all());
        if ($reqQnt > $min && $reqQnt <= $max) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param Request $request
     * @param string $param
     * @return bool
     * Checks whether the specific paramter has been defined within the request given
     */
    private static function paramIsSetValidator(Request $request, string $param)
    {
        if (isset($request->request->all()[$param])) {
            return true;
        } else {
            return false;
        }
    }

    private static function savedListInputValidator(Request $request)
    {
        $reqQnt = count($request->request->all());
        // (1) check the number of request parameters sent
        if ($request->isMethod('POST') && self::paramIsSetValidator($request, "name") && self::reqParamCountValidator($request, 1, 101)) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * @Route("/", name="app_homepage")
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }


    /**
     * @Route("/save", name="savePost")
     */
    public function savePost(Request $request)
    {
        //number git of POST request elements
        $reqQnt = count($request->request->all());
//        $redirection_path = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        $isNameSet = false;
        if($reqQnt <= 101){
            foreach ($request->request->all() as $key => $value) {
                if ($key === "name") {
                    $isNameSet = true;
                }
            }
        }

        if ($isNameSet and $request->getMethod() === 'POST' and $reqQnt > 1 and $reqQnt <= 101 and isset($request->request->all()['name'])) {
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
            $response = new JsonResponse();
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        } else {
            return new JsonResponse();
        }
    }

    /**
     * @Route("/save", name="saveGet")
     */
    public function saveGet()
    {
        $redirection_path = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        return $this->redirect("$redirection_path");
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
            $response->headers->set('Access-Control-Allow-Methods', 'POST');

            return $response;
        } else {
            $redirection_path = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
            return $this->redirect("$redirection_path");
        }
    }

    /**
     * @Route("/about", name="about")
     */
    public function about(Request $request)
    {
        $redirection_path = $_ENV['APP_ENV'] === 'dev' ? "https://localhost:" . $_SERVER['SERVER_PORT'] : "https://listazakupow.com.pl";
        return $this->redirect("$redirection_path");
    }

}
