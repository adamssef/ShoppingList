<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200824192737 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE shopping_list DROP FOREIGN KEY FK_3DC1A459809FD206');
        $this->addSql('DROP INDEX IDX_3DC1A459809FD206 ON shopping_list');
        $this->addSql('ALTER TABLE shopping_list CHANGE shoppinglist_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE shopping_list ADD CONSTRAINT FK_3DC1A459A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_3DC1A459A76ED395 ON shopping_list (user_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE shopping_list DROP FOREIGN KEY FK_3DC1A459A76ED395');
        $this->addSql('DROP INDEX IDX_3DC1A459A76ED395 ON shopping_list');
        $this->addSql('ALTER TABLE shopping_list CHANGE user_id shoppingList_id INT NOT NULL');
        $this->addSql('ALTER TABLE shopping_list ADD CONSTRAINT FK_3DC1A459809FD206 FOREIGN KEY (shoppingList_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_3DC1A459809FD206 ON shopping_list (shoppingList_id)');
    }
}
