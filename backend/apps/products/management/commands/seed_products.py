from django.core.management.base import BaseCommand
from apps.products.models import Product


PRODUCTS = [
    {
        'name': 'Slim-Fit Jeans', 'category': 'Джинси', 'emoji': '👖',
        'price': 2890, 'old_price': 3500, 'badge': 'Хіт',
        'description': 'Класичні чорні джинси зі стрейч-тканини. Ідеальна посадка на кожен день.',
        'sizes': ['28', '30', '32', '34', '36', '38'],
        'details': {'Склад': '98% Бавовна, 2% Еластан', 'Країна': 'Туреччина', 'Посадка': 'Slim Fit', 'Колір': 'Чорний'},
    },
    {
        'name': 'Regular Denim', 'category': 'Джинси', 'emoji': '👖',
        'price': 2590, 'badge': '',
        'description': 'Класичний синій деним. Прямий крій, міцна тканина.',
        'sizes': ['30', '32', '34', '36', '38'],
        'details': {'Склад': '100% Бавовна', 'Країна': 'Туреччина', 'Посадка': 'Regular Fit', 'Колір': 'Синій'},
    },
    {
        'name': 'Oxford Shirt White', 'category': 'Сорочки', 'emoji': '👔',
        'price': 1990, 'old_price': 2400, 'badge': 'New',
        'description': 'Класична оксфордська сорочка. Ідеальна для офісу та вечора.',
        'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
        'details': {'Склад': '100% Бавовна', 'Країна': 'Італія', 'Крій': 'Slim', 'Колір': 'Білий'},
    },
    {
        'name': 'Linen Shirt Black', 'category': 'Сорочки', 'emoji': '👔',
        'price': 2290, 'badge': '',
        'description': 'Льняна сорочка. Легка, дихаюча, ідеальна для теплого сезону.',
        'sizes': ['S', 'M', 'L', 'XL'],
        'details': {'Склад': '100% Льон', 'Країна': 'Португалія', 'Крій': 'Regular', 'Колір': 'Чорний'},
    },
    {
        'name': 'Classic Suit Charcoal', 'category': 'Костюми', 'emoji': '🤵',
        'price': 12900, 'old_price': 15000, 'badge': 'Premium',
        'description': 'Класичний двійка. Вовняна тканина, ідеальний крій.',
        'sizes': ['46', '48', '50', '52', '54'],
        'details': {'Склад': '70% Вовна, 30% Поліестер', 'Країна': 'Польща', 'Тип': 'Двійка', 'Колір': 'Антрацит'},
    },
    {
        'name': 'Navy Blue Suit', 'category': 'Костюми', 'emoji': '🤵',
        'price': 11500, 'badge': '',
        'description': 'Темно-синій костюм — класика преміум-класу.',
        'sizes': ['46', '48', '50', '52'],
        'details': {'Склад': '65% Вовна, 35% Поліестер', 'Країна': 'Польща', 'Тип': 'Двійка', 'Колір': 'Темно-синій'},
    },
    {
        'name': 'Sport Suit Track', 'category': 'Спорт', 'emoji': '🏃',
        'price': 4900, 'old_price': 5800, 'badge': 'Sale',
        'description': 'Стильний спортивний костюм. Дихаюча тканина.',
        'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
        'details': {'Склад': '80% Поліестер, 20% Бавовна', 'Країна': 'Туреччина', 'Тип': 'Брюки + Худі', 'Колір': 'Чорний'},
    },
    {
        'name': 'Jogger Set Grey', 'category': 'Спорт', 'emoji': '🏃',
        'price': 3900, 'badge': '',
        'description': 'Джоггер-сет у сірому кольорі. Мінімалістичний дизайн.',
        'sizes': ['S', 'M', 'L', 'XL'],
        'details': {'Склад': '75% Бавовна, 25% Поліестер', 'Країна': 'Туреччина', 'Тип': 'Брюки + Толстовка', 'Колір': 'Сірий'},
    },
    {
        'name': 'Leather Jacket Black', 'category': 'Куртки', 'emoji': '🧥',
        'price': 8900, 'old_price': 11000, 'badge': 'Premium',
        'description': 'Шкіряна куртка — вічна класика. Натуральна шкіра.',
        'sizes': ['S', 'M', 'L', 'XL'],
        'details': {'Склад': '100% Натуральна шкіра', 'Країна': 'Іспанія', 'Тип': 'Косуха', 'Колір': 'Чорний'},
    },
    {
        'name': 'Bomber Olive', 'category': 'Куртки', 'emoji': '🧥',
        'price': 5900, 'badge': '',
        'description': 'Бомбер в кольорі олива. Сучасний фасон, тепла підкладка.',
        'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
        'details': {'Склад': 'Поліестер, Нейлон', 'Країна': 'Туреччина', 'Тип': 'Бомбер', 'Колір': 'Олива'},
    },
    {
        'name': 'Air Max Pro', 'category': 'Кросівки', 'emoji': '👟',
        'price': 6500, 'old_price': 7900, 'badge': 'New',
        'description': 'Преміальні кросівки Air Max. Легкі, дихаючі.',
        'sizes': ['39', '40', '41', '42', '43', '44', '45'],
        'details': {'Матеріал': 'Сітка + шкіра', 'Підошва': 'Гума Air', 'Країна': "В'єтнам", 'Колір': 'Білий/Чорний'},
    },
    {
        'name': 'Suede Sneaker White', 'category': 'Кросівки', 'emoji': '👟',
        'price': 5200, 'badge': '',
        'description': 'Замшеві кросівки. Простота та елегантність.',
        'sizes': ['40', '41', '42', '43', '44'],
        'details': {'Матеріал': 'Натуральна замша', 'Підошва': 'Гума', 'Країна': 'Португалія', 'Колір': 'Білий'},
    },
]


class Command(BaseCommand):
    help = 'Заповнити базу даних тестовими товарами'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Очистити перед заповненням')

    def handle(self, *args, **options):
        if options['clear']:
            count, _ = Product.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Видалено {count} товарів'))

        created = 0
        for data in PRODUCTS:
            obj, is_new = Product.objects.get_or_create(
                name=data['name'],
                defaults={**data},
            )
            if is_new:
                created += 1
            else:
                # оновлюємо дані якщо товар вже є
                for k, v in data.items():
                    setattr(obj, k, v)
                obj.save()

        self.stdout.write(self.style.SUCCESS(
            f'✅ Готово! Створено нових: {created}, всього: {Product.objects.count()}'
        ))

