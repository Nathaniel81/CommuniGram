# Generated by Django 5.0.3 on 2024-04-30 14:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_alter_message_message'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='room',
        ),
        migrations.RemoveField(
            model_name='message',
            name='user',
        ),
        migrations.DeleteModel(
            name='ChatRoom',
        ),
        migrations.DeleteModel(
            name='Message',
        ),
    ]
