from django import forms
from .models import Recepcionista

class RecepcionistaForm(forms.ModelForm):
    class Meta:
        model = Recepcionista
        fields = ['matricula']
        widgets = {
            'matricula': forms.TextInput(attrs={'class': 'form-control'}),
        }