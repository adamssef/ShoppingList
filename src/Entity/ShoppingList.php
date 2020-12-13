<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\JoinColumn;
use Symfony\Component\Serializer\Annotation2Depth;


/**
 * @ORM\Entity(repositoryClass="App\Repository\ShoppingListRepository")
 */
class ShoppingList
{
    /**
     * @Groups("ListDataToBeSerialized")
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user): void
    {
        $this->user = $user;
    }


    /**
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="shoppingLists")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $user;

    /**
     * @Groups("ListDataToBeSerialized")
     * @ORM\Column(type="string", nullable=true)
     */
    private $name;


    /**
     * @Groups("ListDataToBeSerialized")
     * @ORM\Column(type="text")
     */
    private $listItems = [];

    /**
     * @Groups("ListDataToBeSerialized")
     * @ORM\Column(type="datetime")
     */
    private $creationDate;

    /**
     * @Groups("ListDataToBeSerialized")
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $modificationDate;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getListItems()
    {
        return $this->listItems;
    }

    public function setListItems( $listItems): self
    {
        $this->listItems = $listItems;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getModificationDate(): ?\DateTimeInterface
    {
        return $this->modificationDate;
    }

    public function setModificationDate(?\DateTimeInterface $modificationDate): self
    {
        $this->modificationDate = $modificationDate;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName($name): self
    {
        $this->name = $name;

        return $this;
    }
}
