from rest_framework import serializers
from .models import issues

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = issues
        fields = "__all__"
        read_only_fields = ('user',)  # ignore user in requests
