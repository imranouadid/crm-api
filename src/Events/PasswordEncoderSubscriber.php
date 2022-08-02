<?php

namespace App\Events;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    private $encoder;

    public function __construct(UserPasswordHasherInterface $encoder){
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents(){
        return [
            KernelEvents::VIEW => [
                'encodePassword',
                EventPriorities::PRE_WRITE
            ]
        ];
    }

    public function encodePassword(ViewEvent $event){

        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof User && Request::METHOD_POST === $method) {
            $result->setPassword($this->encoder->hashPassword($result, $result->getPassword()));
        }

    }
}