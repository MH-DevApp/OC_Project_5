<?php

/**
 * ContainerTest file
 *
 * PHP Version 8.1
 *
 * @category PHP
 * @package  OC_P5_BLOG
 * @author   Mehdi Haddou <mehdih.devapp@gmail.com>
 * @license  MIT Licence
 * @link     https://p5.mehdi-haddou.fr
 */

declare(strict_types=1);

namespace tests\Service\Container;


use App\Auth\Auth;
use App\Factory\Manager\Manager;
use App\Factory\Router\Request;
use App\Factory\Router\Router;
use App\Factory\Utils\DotEnv\DotEnv;
use App\Factory\Utils\DotEnv\DotEnvException;
use App\Service\Container\Container;
use App\Service\Container\ContainerInterface;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestDox;
use PHPUnit\Framework\TestCase;
use ReflectionException;

/**
 * Test Container cases
 *
 * PHP Version 8.1
 *
 * @category PHP
 * @package  OC_P5_BLOG
 * @author   Mehdi Haddou <mehdih.devapp@gmail.com>
 * @license  MIT Licence
 * @link     https://p5.mehdi-haddou.fr
 */
#[CoversClass(Container::class)]
class ContainerTest extends TestCase
{


    /**
     * Test should be loaded all service in container of services.
     *
     * @return void
     *
     * @throws ReflectionException
     * @throws DotEnvException
     */
    #[Test]
    #[TestDox("should be loaded all service in container of services")]
    public function itLoadAllServices(): void
    {
        $_ENV["TEST_PATH"] = "_test";
        (new DotEnv())->load();

        Container::loadServices();
        $this->assertCount(4, Container::getServices());

        foreach (Container::getServices() as $service) {
            $this->assertInstanceOf(ContainerInterface::class, $service);
        }

        $this->assertInstanceOf(Request::class, Container::getService("request"));
        $this->assertInstanceOf(Manager::class, Container::getService("manager"));
        $this->assertInstanceOf(Auth::class, Container::getService("auth"));
        $this->assertInstanceOf(Router::class, Container::getService("router"));

    }


}
