<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;


class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {

    private Security $security;
    private AuthorizationCheckerInterface $authChecker;

    public function __construct(Security $security, AuthorizationCheckerInterface $authChecker){
        $this->security = $security;
        $this->authChecker = $authChecker;
    }

    public function addWhereCurrentUser(QueryBuilder $queryBuilder, string $resourceClass){
        $user = $this->security->getUser();
        if(( $resourceClass === Customer::class || $resourceClass === Invoice::class ) &&
            !$this->authChecker->isGranted("ROLE_ADMIN") && $user instanceof User){

            $rootAlias = $queryBuilder->getRootAliases()[0];

            if($resourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }else{

                $queryBuilder->join("$rootAlias.customer", "c")
                              ->andWhere("c.user = :user");
            }
            $queryBuilder->setParameter('user', $user);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
                                      string $resourceClass, string $operationName = null){
        $this->addWhereCurrentUser($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
                                string $resourceClass, array $identifiers, string $operationName = null,
                                array $context = []){
        $this->addWhereCurrentUser($queryBuilder, $resourceClass);
    }
}