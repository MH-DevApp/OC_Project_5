<?php

/**
 * ForgottenPasswordResetForm file
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

namespace App\Factory\Form;

/**
 * ForgottenPasswordResetForm class
 *
 * ForgottenPassword form builder with sanitize,
 * validation, and errors for fields.
 *
 * @category PHP
 * @package  OC_P5_BLOG
 * @author   Mehdi Haddou <mehdih.devapp@gmail.com>
 * @license  MIT Licence
 * @link     https://p5.mehdi-haddou.fr
 */
final class ForgottenPasswordResetForm extends AbstractForm
{
    protected string $csrfKey = "forgotten-password-reset";


    /**
     * Constructor
     *
     * @param object|null $entity
     *
     * @throws FormException
     */
    public function __construct(?object $entity = null)
    {
        parent::__construct($entity);
    }


    /**
     * Builder connexion form
     *
     * @return void
     *
     * @throws FormException
     */
    public function builder(): void
    {
        parent::builder();

        $this
            ->addField("newPassword", options: [
                "validation" => function ($value) {
                    if (empty($value)) {
                        $this->setError(
                            "newPassword",
                            self::ERROR_REQUIRED
                        );

                        return false;
                    }

                    if (strlen($value) < 6 || strlen($value) > 20) {
                        $this->setError(
                            "newPassword",
                            sprintf(self::ERROR_LENGTH, 6, 20)
                        );

                        return false;
                    }

                    if (!isset($this->fields["data"]["newPassword"]) ||
                        !isset($this->fields["data"]["confirmNewPassword"]) ||
                        $this->fields["data"]["newPassword"] !== $this->fields["data"]["confirmNewPassword"]
                    ) {
                        $this->setError(
                            "newPassword",
                            "La confirmation du mot de passe n'est pas identique."
                        );

                        return false;
                    }

                    return true;
                }
            ])
            ->addField("confirmNewPassword", options: [
                "mapped" => false
            ])
        ;
    }
}
