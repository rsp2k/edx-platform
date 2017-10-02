"""
Course Goals Models
"""
from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from openedx.core.djangoapps.xmodule_django.models import CourseKeyField
from model_utils import Choices


# Each goal is represented by a goal key and a string description.
GOAL_KEY_CHOICES = Choices(
    ('certify', _('Earn a certificate.')),
    ('complete', _('Complete the course.')),
    ('explore', _('Explore the course.')),
    ('unsure', _('Not sure yet.')),
)

from .api import add_course_goal, remove_course_goal
from student.models import CourseEnrollment


class CourseGoal(models.Model):
    """
    Represents a course goal set by a user on the course home page.
    """
    user = models.ForeignKey(User, blank=False)
    course_key = CourseKeyField(max_length=255, db_index=True)
    goal_key = models.CharField(max_length=100, choices=GOAL_KEY_CHOICES, default=GOAL_KEY_CHOICES.unsure)

    def __unicode__(self):
        return 'CourseGoal: {user} set goal to {goal} for course {course}'.format(
            user=self.user.username,
            course=self.course_key,
            goal_key=self.goal_key,
        )

    class Meta:
        unique_together = ("user", "course_key")


@receiver(models.signals.post_save, sender=CourseEnrollment, dispatch_uid="store_course_goal_on_enroll")
def set_course_goal_verified(sender, instance, **kwargs):  # pylint: disable=unused-argument, invalid-name
    """Set the course goal to certify when the user enrolls as a verified user. """
    ## If the user enrolls in a verified state or upgrades, create a course goal
    if instance.mode == 'verified':
        add_course_goal(instance.user, instance.course_id, 'certify')


@receiver(models.signals.post_delete, sender=CourseEnrollment, dispatch_uid="remove_course_goal_on_unenroll")
def remove_course_goal_on_unenroll(sender, instance, **kwargs):  # pylint: disable=unused-argument, invalid-name
    """Remove course goal on unenroll. """
    remove_course_goal(instance.user, instance.course_id)
