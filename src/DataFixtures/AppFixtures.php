<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture{

    private $encoder;

    public function __construct(UserPasswordHasherInterface $encoder){
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager): void{

        $faker = Factory::create('fr_FR');

        for($u=0; $u<10; $u++){

            $chrono = 1;

            $user = new User();
            $hash = $this->encoder->hashPassword($user,"password");

            $user->setEmail($faker->email);
            $user->setFirstName($faker->firstName);
            $user->setLastName($faker->lastName);
            $user->setPassword($hash);

            $manager->persist($user);

            for($i=0; $i< mt_rand(5, 25); $i++){
                $customer = new Customer();
                $customer->setFirstName($faker->firstName);
                $customer->setLastName($faker->lastName);
                $customer->setCompany($faker->company);
                $customer->setEmail($faker->email);
                $customer->setUser($user);


                $manager->persist($customer);

                for($j=0 ; $j<mt_rand(3, 10); $j++ ){
                    $invoice = new Invoice();
                    $invoice->setCustomer($customer)
                        ->setAmount($faker->randomFloat(2, 150, 5000))
                        ->setSentAt($faker->dateTimeBetween("-6 months"))
                        ->setStatus($faker->randomElement(["SENT", "PAID", "CANCELLED"]))
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($invoice);
                }
            }
        }



        $manager->flush();
    }
}
