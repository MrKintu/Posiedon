# Generated by Django 5.0.7 on 2024-07-27 06:18

import django.db.models.deletion
import users.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        choices=[("Mr", "Mr"), ("Mrs", "Mrs"), ("Ms", "Ms")],
                        max_length=100,
                        null=True,
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[("Male", "Male"), ("Female", "Female")],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("d_o_b", models.DateField(null=True)),
                ("phone", models.CharField(max_length=100, null=True)),
                (
                    "profile_image",
                    models.ImageField(null=True, upload_to=users.models.rename_image),
                ),
                ("subscribed", models.BooleanField(default=False)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Marketer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        choices=[("Mr", "Mr"), ("Mrs", "Mrs"), ("Ms", "Ms")],
                        max_length=100,
                        null=True,
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[("Male", "Male"), ("Female", "Female")],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("d_o_b", models.DateField(null=True)),
                ("phone", models.CharField(max_length=100, null=True)),
                (
                    "profile_image",
                    models.ImageField(null=True, upload_to=users.models.rename_image),
                ),
                ("customers", models.ManyToManyField(blank=True, to="users.customer")),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
