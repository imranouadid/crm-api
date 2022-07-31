<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;


#[AsController]
class InvoiceIncrementationController extends AbstractController{

    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }

    public function __invoke(Invoice $data){

        $data->setChrono($data->getChrono() + 1);

        $this->em->persist($data);
        $this->em->flush();

        return $data;

    }

}
