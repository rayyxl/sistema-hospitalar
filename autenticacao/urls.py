from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('cadastro/', views.register_view, name='register'),
    path('esqueci-senha/', views.forgot_password_view, name='forgot_password'),
    path('logout/', views.logout_view, name='logout'),

]