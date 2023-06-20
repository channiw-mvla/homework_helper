# Generated by Django 4.2.2 on 2023-06-09 23:36

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homework_helper', '0009_remove_post_stars_reply_stars'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='reply',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_replies', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Rating',
        ),
    ]
