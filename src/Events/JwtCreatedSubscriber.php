<?php

namespace App\Events;

use JetBrains\PhpStorm\NoReturn;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{

    #[NoReturn]
    public function updateJwtData(JWTCreatedEvent $event){
        $user = $event->getUser();
        $data = $event->getData();

        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }


}