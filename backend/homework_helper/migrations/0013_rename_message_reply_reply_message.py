# Generated by Django 4.2.2 on 2023-06-10 00:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('homework_helper', '0012_reply_likes'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reply',
            old_name='message',
            new_name='reply_message',
        ),
    ]
