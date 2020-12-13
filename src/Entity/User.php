<?php

namespace App\Entity;

use App\Repository\UserRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Entity\ShoppingList;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\JoinColumn;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("UserDataToBeSerialized")
     */
    private $id;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ShoppingList", mappedBy="user")
     * @MaxDepth(2)
     */
    private $shoppingLists;


    public function __construct()
    {
        $this->shoppingLists = new ArrayCollection();
    }



    /**
     * @return mixed
     */
    public function getShoppingLists()
    {
        return $this->shoppingLists;
    }

    /**
     * @param mixed $shoppingLists
     */
    public function setShoppingLists($shoppingLists): void
    {
        $this->shoppingLists = $shoppingLists;
    }


    /**
     * @Groups("UserDataToBeSerialized")
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $email;

    /**
     * @Groups("UserDataToBeSerialized")
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @Groups("UserDataToBeSerialized")
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @Groups("UserDataToBeSerialized")
     * @ORM\Column(type="string", length=255)
     */
    private $firstName;

    /**
     * @Groups("UserDataToBeSerialized")
     * @ORM\Column(type="datetime")
     */
    private $regDate;

    /**
     * @return mixed
     */
    public function getRegDate()
    {
        return $this->regDate;
    }

    /**
     * @param mixed $regDate
     */
    public function setRegDate(): void
    {
        $this->regDate = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }
}
