<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface {

    private $security;

    public function __construct(Security $security){
        $this->security = $security;
    }

    public static function getSubscribedEvents(){
        return [
            KernelEvents::VIEW => [
                'setUserCustomer',
                EventPriorities::PRE_VALIDATE
            ]
        ];
    }

    public function setUserCustomer(ViewEvent $event){

        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Customer && Request::METHOD_POST === $method) {
            $user = $this->security->getUser();
            $result->setUser($user);
        }

    }
}