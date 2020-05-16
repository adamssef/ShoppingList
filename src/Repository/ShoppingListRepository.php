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
//        $dql = 'SELECT s FROM App\Entity\ShoppingList s ORDER BY s.id DESC';
        $result = $this->getEntityManager()->getRepository(ShoppingList::class)->createQueryBuilder('s')
            ->orderBy('s.id', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();

        for ($i = 0; $i < count($result); $i++) {
            $listItemsUnserialized = unserialize($result[$i]->getListItems());
            $result[$i]->setListItems($listItemsUnserialized);
        }

        return $result;
    }

}
