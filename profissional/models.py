from django.db import models
from django.contrib.auth.models import User
from .choices import UFs_CHOICES

# Create your models here.
class Profissional(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    uf = models.CharField(max_length=2, choices=UFs_CHOICES, blank=True, null=True)

    def __str__(self):
        return self.user.get_full_name()