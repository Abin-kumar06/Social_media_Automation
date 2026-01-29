from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer
from .tasks import generate_post_text_task

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        post = serializer.save()
        # Trigger background task
        post.status = 'generating'
        post.save()
        generate_post_text_task.delay(post.id)
