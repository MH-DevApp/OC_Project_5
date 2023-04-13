<?php

/**
 * PostController file
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

namespace App\Controller;


use App\Factory\Router\Response;
use App\Repository\PostRepository;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

/**
 * PostController class
 *
 * PHP Version 8.1
 *
 * @category PHP
 * @package  OC_P5_BLOG
 * @author   Mehdi Haddou <mehdih.devapp@gmail.com>
 * @license  MIT Licence
 * @link     https://p5.mehdi-haddou.fr
 */
class PostController extends AbstractController
{

    private PostRepository $postRepository;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->postRepository = new PostRepository();

    }


    /**
     * Posts list of Post controller
     *
     * @throws SyntaxError|RuntimeError|LoaderError
     */
    public function showPosts(): Response
    {
        $posts = $this->postRepository->getPostsByOrderDate("DESC");

        return $this->render("post/show-posts.html.twig", [
            "posts" => $posts
        ]);

    }


    /**
     * Post details by Id of Post controller
     *
     * @throws SyntaxError|RuntimeError|LoaderError
     */
    public function showPost(string $postId): Response
    {
        $post = $this->postRepository->getPostByIdWithUser($postId);

        if (empty($post)) {
            return new Response("", 404, ["HTTP/1.0 404 Not Found"]);
        }

        return $this->render("post/show-post.html.twig", [
            "post" => $post
        ]);
    }


}
