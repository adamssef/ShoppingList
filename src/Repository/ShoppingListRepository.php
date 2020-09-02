<?php

namespace App\Repository;

use App\Entity\ShoppingList;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

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


    public function listAllShoppingLists()
    {
        $result = $this->getEntityManager()->getRepository(ShoppingList::class)->createQueryBuilder('s')
            ->select('s.listItems', 's.creationDate')
            ->orderBy('s.creationDate', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();


        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['listItems'] = unserialize($result[$i]['listItems']);
        }

        return $result;
    }

}
