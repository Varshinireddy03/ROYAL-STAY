from django.core.management.base import BaseCommand
from hotel.models import Complaint, Reservation, User

class Command(BaseCommand):
    help = 'Add sample unassigned complaints for testing'

    def handle(self, *args, **options):
        # Get some existing reservations and their guest users
        reservations = Reservation.objects.all()[:3]
        
        if not reservations:
            self.stdout.write(self.style.ERROR('No reservations found. Please create reservations first.'))
            return

        sample_complaints = [
            {
                'subject': 'Noisy neighbors in adjacent room',
                'detail': 'The guests in room 202 are making excessive noise late at night. This has disrupted my sleep for the past two nights. Please take action immediately.',
            },
            {
                'subject': 'Broken air conditioning',
                'detail': 'The AC in my room is not working properly. It\'s making strange noises and not cooling the room effectively. I need it fixed ASAP.',
            },
            {
                'subject': 'Dirty bathroom',
                'detail': 'The bathroom was not cleaned properly. There are hair strands in the bathtub and the floor is wet. Please send housekeeping immediately.',
            },
            {
                'subject': 'Cold water in shower',
                'detail': 'There is no hot water in the shower. I\'ve tried multiple times but only cold water comes out. This is unacceptable for the room rate.',
            },
            {
                'subject': 'Missing items from room',
                'detail': 'I left my watch and phone charger on the bedside table when I went to breakfast, but they are missing now. I need to file a complaint about theft.',
            },
        ]

        created_count = 0
        for i, complaint_data in enumerate(sample_complaints):
            reservation = reservations[i % len(reservations)]
            
            complaint = Complaint.objects.create(
                reservation=reservation,
                posted_by=reservation.guest,
                subject=complaint_data['subject'],
                detail=complaint_data['detail'],
                status='OPEN',
                assigned_to=None  # No one assigned
            )
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'✓ Created complaint: "{complaint.subject}" (ID: {complaint.id})'))

        self.stdout.write(self.style.SUCCESS(f'\n✓ Successfully created {created_count} unassigned complaints!'))
