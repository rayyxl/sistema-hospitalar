from django import forms
from ..profissional.models import Profissional

class ProfissionalForm(forms.ModelForm):
    class Meta:
        model = Profissional
        fields = ['telefone', 'data_nascimento', 'uf']
        widgets = {
            'telefone': forms.TextInput(attrs={'class': 'form-control'}),
            'data_nascimento': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'uf': forms.Select(attrs={'class': 'form-control'}),
        }