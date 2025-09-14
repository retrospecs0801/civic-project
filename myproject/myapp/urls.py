from django.urls import path
from . import views



urlpatterns = [
    path("user/login/",views.user_login,name="user_login"),
    path("admin/login/",views.admin_login,name = "admin_login"),
    path("user/dashboard/",views.user_dashboard,name="user_dashboard"),
    path("admin/dashboard/",views.admin_dashboard,name="admin_dashboard"),
    path("user/register/",views.register,name = "register"),
    path("user/logout/", views.logout_view, name="logout"),
    path("admin/logout/", views.logout_view, name="logout"),
    path("user/myissues/",views.my_issues, name = "myissues"),
    path("user/community/",views.community, name = "community"),
    path("admin/dashboard/search/", views.search_issues, name="search"),
]
