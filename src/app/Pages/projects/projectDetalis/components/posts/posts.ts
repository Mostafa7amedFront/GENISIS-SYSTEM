import { Component, signal } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';

interface Post {
  title: string;
  date: string;
  caption: string;
  captionArabic: string;
  description: string;
  image: string;
}
@Component({
  selector: 'app-posts',
  imports: [ReactiveModeuls],
  templateUrl: './posts.html',
  styleUrl: './posts.scss'
})
export class Posts {
  percent = 60;

  setPercent(value: number) {
    this.percent = Math.max(0, Math.min(100, Math.round(value)));
  }

  simulateLoading() {
    this.percent = 0;
    const interval = setInterval(() => {
      if (this.percent < 100) this.percent++;
      else clearInterval(interval);
    }, 50);
  }
  monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL",
    "MAY", "JUNE", "JULY", "AUGUST",
    "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  currentDate = new Date();
  currentMonth = signal(this.currentDate.getMonth());
  currentYear = signal(this.currentDate.getFullYear());

  selectMonth(index: number) {
    this.currentMonth.set(index);
  }
  posts: Post[] = [
    {
      title: 'POST 01',
      date: 'SEP 12',
      description: 'With Naseem, your products stay in polar conditions',
      caption: `With Naseem, your products stay in polar conditions even in the peak of heat. 
                Our advanced technology ensures that perishable items are preserved perfectly, 
                allowing your business to deliver products that maintain their freshness and quality. 
                You no longer need to worry about temperature fluctuations, and every shipment arrives 
                in ideal condition, keeping your clients satisfied and loyal.`,
      captionArabic: `مع نسيم، منتجاتك تظل في أجواء قطبية حتى في أشد الحر. 
                      تضمن تقنيتنا المتقدمة الحفاظ على المنتجات القابلة للتلف بشكل مثالي، 
                      مما يسمح لنشاطك التجاري بتوصيل منتجات تحتفظ بجودتها وطزاجتها. 
                      لن تقلق بعد الآن من تغيرات درجة الحرارة، وستصل كل شحنة في أفضل حالة، 
                      مما يرضي عملائك ويزيد من ولائهم.`,
      image: 'assets/img/Rectangle.jpg'
    },
    {
      title: 'POST 02',
      date: 'OCT 05',
      description: 'Ensuring maximum freshness with Naseem',
      caption: `Our innovative cooling solutions guarantee that each item remains at optimal temperature. 
                Whether it's fruits, vegetables, or sensitive pharmaceuticals, Naseem's system 
                protects your inventory throughout the supply chain. Customers can trust that 
                every product they receive meets the highest quality standards, reducing waste 
                and increasing satisfaction. This technology is essential for modern logistics.`,
      captionArabic: `تضمن حلول التبريد المبتكرة لدينا أن تظل كل سلعة في درجة الحرارة المثلى. 
                      سواء كانت فواكه، خضروات، أو أدوية حساسة، يحمي نظام نسيم مخزونك طوال سلسلة التوريد. 
                      يمكن للعملاء الثقة في أن كل منتج يصلهم يلبي أعلى معايير الجودة، مما يقلل من الهدر 
                      ويزيد من رضاهم. هذه التقنية ضرورية للخدمات اللوجستية الحديثة.`,
      image: 'assets/img/Rectangle.jpg'
    },
    {
      title: 'POST 03',
      date: 'NOV 10',
      description: 'Revolutionizing product delivery',
      caption: `By adopting Naseem, businesses experience a revolutionary shift in product delivery. 
                Our climate-controlled technology allows shipments to remain untouched by extreme conditions, 
                whether hot or cold. This ensures a seamless experience for both vendors and consumers, 
                guaranteeing that the goods retain their intended quality. Long-distance deliveries are no 
                longer a challenge, and client satisfaction reaches new heights with every order.`,
      captionArabic: `باستخدام نسيم، تشهد الشركات تحولاً ثورياً في تسليم المنتجات. 
                      تتيح تقنيتنا المراقبة للمناخ أن تظل الشحنات محمية من الظروف القاسية سواء كانت حرارة أو برد. 
                      هذا يضمن تجربة سلسة للبائعين والمستهلكين على حد سواء، مع ضمان الحفاظ على جودة المنتجات كما هو مقصود. 
                      لم تعد الشحنات لمسافات طويلة تمثل تحدياً، ويصل رضا العملاء إلى مستويات جديدة مع كل طلب.`,
      image: 'assets/img/Rectangle.jpg'
    },
        {
      title: 'POST 04',
      date: 'DEC 01',
      description: 'Keeping products safe and fresh',
      caption: `Naseem’s technology actively monitors temperature and humidity to ensure products 
                are always in ideal conditions. Our sensors detect even the smallest deviation and 
                automatically adjust the environment to maintain freshness. This advanced monitoring 
                ensures minimal spoilage, extends shelf life, and increases reliability in your supply chain, 
                making Naseem an indispensable partner for businesses that prioritize quality.`,
      captionArabic: `تراقب تقنية نسيم درجة الحرارة والرطوبة بشكل نشط لضمان أن المنتجات دائمًا في أفضل حالة. 
                      تكشف مستشعراتنا عن أي انحراف بسيط وتقوم تلقائياً بضبط البيئة للحفاظ على الطزاجة. 
                      هذا المراقبة المتقدمة تضمن تقليل التلف، وزيادة مدة صلاحية المنتجات، وتعزيز الاعتمادية في سلسلة التوريد، 
                      مما يجعل نسيم شريكًا لا غنى عنه للشركات التي تعطي الأولوية للجودة.`,
      image: 'assets/img/Rectangle.jpg'
    },
    {
      title: 'POST 05',
      date: 'DEC 01',
      description: 'Keeping products safe and fresh',
      caption: `Naseem’s technology actively monitors temperature and humidity to ensure products 
                are always in ideal conditions. Our sensors detect even the smallest deviation and 
                automatically adjust the environment to maintain freshness. This advanced monitoring 
                ensures minimal spoilage, extends shelf life, and increases reliability in your supply chain, 
                making Naseem an indispensable partner for businesses that prioritize quality.`,
      captionArabic: `تراقب تقنية نسيم درجة الحرارة والرطوبة بشكل نشط لضمان أن المنتجات دائمًا في أفضل حالة. 
                      تكشف مستشعراتنا عن أي انحراف بسيط وتقوم تلقائياً بضبط البيئة للحفاظ على الطزاجة. 
                      هذا المراقبة المتقدمة تضمن تقليل التلف، وزيادة مدة صلاحية المنتجات، وتعزيز الاعتمادية في سلسلة التوريد، 
                      مما يجعل نسيم شريكًا لا غنى عنه للشركات التي تعطي الأولوية للجودة.`,
      image: 'assets/img/Rectangle.jpg'
    },
      {
      title: 'POST 06',
      date: 'DEC 01',
      description: 'Keeping products safe and fresh',
      caption: `Naseem’s technology actively monitors temperature and humidity to ensure products 
                are always in ideal conditions. Our sensors detect even the smallest deviation and 
                automatically adjust the environment to maintain freshness. This advanced monitoring 
                ensures minimal spoilage, extends shelf life, and increases reliability in your supply chain, 
                making Naseem an indispensable partner for businesses that prioritize quality.`,
      captionArabic: `تراقب تقنية نسيم درجة الحرارة والرطوبة بشكل نشط لضمان أن المنتجات دائمًا في أفضل حالة. 
                      تكشف مستشعراتنا عن أي انحراف بسيط وتقوم تلقائياً بضبط البيئة للحفاظ على الطزاجة. 
                      هذا المراقبة المتقدمة تضمن تقليل التلف، وزيادة مدة صلاحية المنتجات، وتعزيز الاعتمادية في سلسلة التوريد، 
                      مما يجعل نسيم شريكًا لا غنى عنه للشركات التي تعطي الأولوية للجودة.`,
      image: 'assets/img/Rectangle.jpg'
    },
        {
      title: 'POST 07',
      date: 'OCT 05',
      description: 'Ensuring maximum freshness with Naseem',
      caption: `Our innovative cooling solutions guarantee that each item remains at optimal temperature. 
                Whether it's fruits, vegetables, or sensitive pharmaceuticals, Naseem's system 
                protects your inventory throughout the supply chain. Customers can trust that 
                every product they receive meets the highest quality standards, reducing waste 
                and increasing satisfaction. This technology is essential for modern logistics.`,
      captionArabic: `تضمن حلول التبريد المبتكرة لدينا أن تظل كل سلعة في درجة الحرارة المثلى. 
                      سواء كانت فواكه، خضروات، أو أدوية حساسة، يحمي نظام نسيم مخزونك طوال سلسلة التوريد. 
                      يمكن للعملاء الثقة في أن كل منتج يصلهم يلبي أعلى معايير الجودة، مما يقلل من الهدر 
                      ويزيد من رضاهم. هذه التقنية ضرورية للخدمات اللوجستية الحديثة.`,
      image: 'assets/img/Rectangle.jpg'
    },
    {
      title: 'POST 08',
      date: 'NOV 10',
      description: 'Revolutionizing product delivery',
      caption: `By adopting Naseem, businesses experience a revolutionary shift in product delivery. 
                Our climate-controlled technology allows shipments to remain untouched by extreme conditions, 
                whether hot or cold. This ensures a seamless experience for both vendors and consumers, 
                guaranteeing that the goods retain their intended quality. Long-distance deliveries are no 
                longer a challenge, and client satisfaction reaches new heights with every order.`,
      captionArabic: `باستخدام نسيم، تشهد الشركات تحولاً ثورياً في تسليم المنتجات. 
                      تتيح تقنيتنا المراقبة للمناخ أن تظل الشحنات محمية من الظروف القاسية سواء كانت حرارة أو برد. 
                      هذا يضمن تجربة سلسة للبائعين والمستهلكين على حد سواء، مع ضمان الحفاظ على جودة المنتجات كما هو مقصود. 
                      لم تعد الشحنات لمسافات طويلة تمثل تحدياً، ويصل رضا العملاء إلى مستويات جديدة مع كل طلب.`,
      image: 'assets/img/Rectangle.jpg'
    },
    {
      title: 'POST 09',
      date: 'DEC 01',
      description: 'Keeping products safe and fresh',
      caption: `Naseem’s technology actively monitors temperature and humidity to ensure products 
                are always in ideal conditions. Our sensors detect even the smallest deviation and 
                automatically adjust the environment to maintain freshness. This advanced monitoring 
                ensures minimal spoilage, extends shelf life, and increases reliability in your supply chain, 
                making Naseem an indispensable partner for businesses that prioritize quality.`,
      captionArabic: `تراقب تقنية نسيم درجة الحرارة والرطوبة بشكل نشط لضمان أن المنتجات دائمًا في أفضل حالة. 
                      تكشف مستشعراتنا عن أي انحراف بسيط وتقوم تلقائياً بضبط البيئة للحفاظ على الطزاجة. 
                      هذا المراقبة المتقدمة تضمن تقليل التلف، وزيادة مدة صلاحية المنتجات، وتعزيز الاعتمادية في سلسلة التوريد، 
                      مما يجعل نسيم شريكًا لا غنى عنه للشركات التي تعطي الأولوية للجودة.`,
      image: 'assets/img/Rectangle.jpg'
    },
      
  ];
  currentIndex = signal(0);

  selectPost(index: number) {
    this.currentIndex.set(index);
  }

  nextPost() {
    this.currentIndex.update(i => (i + 1) % this.posts.length);
  }

  prevPost() {
    this.currentIndex.update(i => (i - 1 + this.posts.length) % this.posts.length);
  }
  prevYear() {
    this.currentYear.update(y => y - 1);
  }

  nextYear() {
    this.currentYear.update(y => y + 1);
  }

  prevMonth() {
    this.currentMonth.update(m => (m + 11) % 12);
  }

  nextMonth() {
    this.currentMonth.update(m => (m + 1) % 12);
  }
}
