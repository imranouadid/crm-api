<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Controller\InvoiceIncrementationController;
use App\Repository\InvoiceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    itemOperations: [
        'get', 'put', 'delete',
        'increment' => [
            'method' => 'post',
            'path' => '/invoices/{id}/increment',
            'controller' => InvoiceIncrementationController::class,
            'openapi_context' => [
                'summary' => 'Increment an invoice',
                'description' => 'Increment the chrono of given invoice',
            ]
        ]
    ],
    subresourceOperations: [
        'api_customers_invoices_get_subresource' => [
            'normalization_context' => [
                'groups' => 'invoices_subresource'
            ]
        ]
    ],
    denormalizationContext: [
        "disable_type_enforcement" => true
    ],
    normalizationContext: [
        'groups' => ['invoices_read']
    ],
    order: [
        "sentAt" => "DESC"
    ],
    paginationEnabled: false
)]
#[ApiFilter(OrderFilter::class, properties: ['amount', 'sentAt'])]
class Invoice{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column()]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Amount of invoice is mandatory")]
    #[Assert\Type(type:"numeric", message: "Amount must be numeric value")]
    #[Assert\PositiveOrZero(message: "Amount must be greater than or equal to zero")]
    private $amount = null;

    #[ORM\Column(length: 255)]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Status of invoice is mandatory")]
    #[Assert\Choice(choices: ["PAID", "CANCELLED", "SENT"], message: "Status must be PAID, CANCELLED or SENT")]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['invoices_read'])]
    #[Assert\NotBlank(message: "Customer of invoice can't be empty")]
    private ?Customer $customer = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Sent date is mandatory")]
    #[Assert\Type("\DateTimeInterface", message: "Sent date must be matched to this format YYYY-MM-DD")]
    private $sentAt = null;

    #[ORM\Column]
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    #[Assert\NotBlank(message: "Chrono of invoice can't be empty")]
    #[Assert\Type(type:"integer", message: "Chrono of the invoice must be integer value")]
    private $chrono = null;


    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    public function getUser():User{
      return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float{
        return $this->amount;
    }

    public function setAmount($amount): self{
        $this->amount = $amount;
        return $this;
    }


    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
