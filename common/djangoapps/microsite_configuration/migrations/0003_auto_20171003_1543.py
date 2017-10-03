# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('microsite_configuration', '0002_auto_20160202_0228'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalmicrositeorganizationmapping',
            name='history_change_reason',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='historicalmicrositetemplate',
            name='history_change_reason',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
