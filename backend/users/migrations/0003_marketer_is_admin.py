# Generated by Django 5.0.7 on 2024-08-06 22:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_remove_customer_d_o_b_remove_customer_gender_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="marketer",
            name="is_admin",
            field=models.BooleanField(default=False),
        ),
    ]
