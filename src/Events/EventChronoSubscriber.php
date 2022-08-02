<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class EventChronoSubscriber implements EventSubscriberInterface {

    private $security;
    private $em;

    public function __construct(EntityManagerInterface $em, Security $security){
        $this->security = $security;
        $this->em = $em;
    }

    public static function getSubscribedEvents(){
        return [
            KernelEvents::VIEW => [
                'sertChronoForInvoice',
                EventPriorities::PRE_VALIDATE
            ]
        ];
    }

    public function sertChronoForInvoice(ViewEvent $event){

        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice && Request::METHOD_POST === $method) {
            $user = $this->security->getUser();
            $nextChrono = $this->em->getRepository(Invoice::class)->findNextChrono($user);

            $result->setChrono($nextChrono);
            if (empty($result->getSentAt())){
                $result->setSentAt(new \DateTime());
            }

        }

    }
}