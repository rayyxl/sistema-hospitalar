from django.db import models
from profissional.models import Profissional

# Create your models here.
class Recepcionista(models.Model):
    profissional = models.OneToOneField(Profissional, on_delete=models.CASCADE)
    matricula = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.profissional.user.get_full_name()