# Generated by Django 4.2.2 on 2023-06-10 00:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('homework_helper', '0010_remove_post_likes_reply_likes_delete_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reply',
            name='likes',
        ),
    ]