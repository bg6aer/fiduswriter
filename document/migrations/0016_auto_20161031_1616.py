# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-31 21:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0015_auto_20161018_0531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accessright',
            name='rights',
            field=models.CharField(choices=[(b'read', b'Reader'), (b'read-without-comments', b'Reader without comment access'), (b'write', b'Writer'), (b'review', b'Reviewer'), (b'comment', b'Commentator'), (b'edit', b'Editor')], max_length=21),
        ),
        migrations.AlterField(
            model_name='document',
            name='settings',
            field=models.TextField(default=b'{"doc_version":1}'),
        ),
    ]
