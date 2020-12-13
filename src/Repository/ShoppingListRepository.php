<?php

namespace App\Repository;

use App\Entity\ShoppingList;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use App\Entity\User;
use Doctrine\ORM\EntityManager;

/**
 * @method ShoppingList|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShoppingList|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShoppingList[]    findAll()
 * @method ShoppingList[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShoppingListRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShoppingList::class);
    }


    public function listAllShoppingLists($id, EntityManagerInterface $em, User $user)
    {

            $result = $this->getEntityManager()->createQuery("SELECT s, u, FROM App\Entity\ShoppingList s JOIN p.user u")->getResult();

        //        $result = $this->getEntityManager()->createQuery("SELECT s, u FROM ShoppingList s JOIN u.id u WHERE u.id = ':id'")->setParameter('id', $id)->getResult();


//        $result = $this->getEntityManager()->getRepository(ShoppingList::class)->createQueryBuilder('s', 'u')
//
//            ->where('s.userId = ?1')
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(200)
//            ->leftJoin('s.user', 'user_id')
//            ->setParameter(1, $id)
//            ->getQuery()
//            ->getResult();

//
//        $result =  $this->createQueryBuilder('shopping_list')
//            ->andWhere('shopping_list.user = :user')
//            ->select('shopping_list.listItems', 'shopping_list.creationDate', 'shopping_list.name', 'shopping_list.modificationDate', 'shopping_list.id', 'user.id')
//            ->setParameter('user', $user)
//            ->setMaxResults(200)
//            ->orderBy('user_id', 'ASC')
//            ->getQuery()
//            ->getResult();
//
//        for ($i = 0; $i < count($result); $i++) {
//            $result[$i]['listItems'] = unserialize($result[$i]['listItems']);
//        }

        return $result;
    }

}
