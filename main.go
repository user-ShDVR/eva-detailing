package main

import (
	"bytes"
	"encoding/json"
	"eva-detailing/components"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// ============================
// Service & Case Data
// ============================

var servicesList = []components.Service{
	{
		Slug:        "antigravel",
		Title:       "Антигравийные плёнки",
		Subtitle:    "Надёжная защита кузова от сколов и царапин",
		Description: "Защита кузова прозрачной полиуретановой плёнкой (PPF) от сколов, гравия, песка и мелких повреждений. Оклейка отдельных зон или полная защита всего кузова. Плёнка самовосстанавливающаяся — мелкие царапины затягиваются при нагреве.",
		HeroImage:   "IMG_0240.webp",
		Tags:        []string{"Полная оклейка", "Частичная оклейка", "Капот и бампер", "Фары", "Зеркала", "Пороги"},
		Steps: []components.Step{
			{Title: "Замер и подбор плёнки", Description: "Подбираем плёнку по типу авто, раскрой по лекалам на плоттере"},
			{Title: "Подготовка кузова", Description: "Мойка, полировка проблемных участков, обезжиривание поверхности"},
			{Title: "Оклейка", Description: "Нанесение плёнки с подворотами, без видимых стыков и пузырей"},
			{Title: "Финишная обработка", Description: "Прогрев строительным феном, прикатка, контроль всех краёв"},
		},
		Prices: []components.Price{
			{Name: "Капот", Price: "от 15 000 ₽"},
			{Name: "Передний бампер", Price: "от 12 000 ₽"},
			{Name: "Фары (пара)", Price: "от 5 000 ₽"},
			{Name: "Полная оклейка", Price: "от 150 000 ₽"},
		},
		Gallery: []string{"опп.webp", "опп2.webp", "опп3.webp", "цп.webp", "цп3.webp", "цп4.webp", "цп5.webp", "цп6.webp", "цп7.webp", "цп8.webp", "цп9.webp", "оп.webp", "оп2.webp", "оп3.webp", "оп4.webp", "оп5.webp", "оп6.webp", "оп7.webp", "оп8.webp", },
	},
	{
		Slug:        "antichrome",
		Title:       "Антихром",
		Subtitle:    "Оклейка хромированных элементов в чёрный",
		Description: "Оклейка хромированных деталей кузова виниловой или полиуретановой плёнкой. Радиаторная решётка, молдинги, рейлинги, оконные рамки — всё приобретает строгий чёрный вид. Защита от коррозии и царапин в комплекте.",
		HeroImage:   "IMG_0353.webp",
		Tags:        []string{"Решётка радиатора", "Молдинги", "Рейлинги", "Оконные рамки", "Эмблемы", "Зеркала"},
		Steps: []components.Step{
			{Title: "Демонтаж элементов", Description: "Аккуратный демонтаж хромированных деталей для качественной оклейки"},
			{Title: "Подготовка поверхности", Description: "Очистка, обезжиривание, при необходимости полировка"},
			{Title: "Оклейка плёнкой", Description: "Нанесение чёрной плёнки с подворотами и прогревом"},
			{Title: "Монтаж и контроль", Description: "Установка деталей обратно, проверка прилегания и внешнего вида"},
		},
		Prices: []components.Price{
			{Name: "Решётка радиатора", Price: "от 5 000 ₽"},
			{Name: "Молдинги (комплект)", Price: "от 8 000 ₽"},
			{Name: "Полный комплекс", Price: "от 25 000 ₽"},
		},
		Gallery: []string{"IMG_0353.webp", "IMG_0356.webp", "IMG_0370.webp", "IMG_0372.webp"},
	},
	{
		Slug:        "polishing",
		Title:       "Полировка ЛКП",
		Subtitle:    "Восстановление блеска лакокрасочного покрытия",
		Description: "Восстановительная и защитная полировка кузова автомобиля. Удаляем голограммы, паутину, мелкие царапины и потёртости. Возвращаем заводской глянец и подготавливаем поверхность под нанесение защитных покрытий. Используем профессиональные пасты Rupes, Koch Chemie.",
		HeroImage:   "FullSizeRender.webp",
		Tags:        []string{"Восстановительная", "Защитная", "Антиголограмма", "Мягкая полировка", "Абразивная"},
		Steps: []components.Step{
			{Title: "Осмотр и замер", Description: "Диагностика ЛКП толщиномером, выявление дефектов под специальным светом"},
			{Title: "Тщательная мойка", Description: "Двухфазная мойка, очистка глиной от вкраплений, маскировка элементов"},
			{Title: "Многоэтапная полировка", Description: "Абразивная и финишная полировка роторной и DA-машинкой"},
			{Title: "Защита поверхности", Description: "Нанесение защитного состава или подготовка под керамику"},
		},
		Prices: []components.Price{
			{Name: "Мягкая полировка", Price: "от 8 000 ₽"},
			{Name: "Восстановительная полировка", Price: "от 15 000 ₽"},
			{Name: "Абразивная полировка", Price: "от 20 000 ₽"},
		},
		Gallery: []string{"FullSizeRender.webp", "FullSizeRender 2.webp", "IMG_1845.webp", "IMG_1848.webp", "плп.webp", "плп2.webp", "плп3.webp", "плп6.webp", "плп7.webp", "плп8.webp", "плп9.webp", "плп10.webp", "плп11.webp", "плп12.webp", },
	},
	{
		Slug:        "optics",
		Title:       "Полировка оптики",
		Subtitle:    "Полировка и восстановление оптики",
		Description: "Профессиональная полировка фар, задних фонарей и противотуманных фар. Удаляем помутнение, желтизну и мелкие царапины. После полировки наносим защитное покрытие для сохранения результата.",
		HeroImage:   "IMG_1850.webp",
		Tags:        []string{"Фары", "Задние фонари", "ПТФ", "Защитное покрытие", "Удаление желтизны"},
		Steps: []components.Step{
			{Title: "Оценка состояния", Description: "Определяем степень помутнения и наличие глубоких повреждений"},
			{Title: "Маскировка", Description: "Защита прилегающих элементов кузова малярным скотчем"},
			{Title: "Полировка", Description: "Многоэтапная полировка специальными пастами для поликарбоната"},
			{Title: "Защитное покрытие", Description: "Нанесение UV-защитного лака для предотвращения повторного помутнения"},
		},
		Prices: []components.Price{
			{Name: "Полировка фар (пара)", Price: "от 3 000 ₽"},
			{Name: "Полировка + защитный лак", Price: "от 5 000 ₽"},
			{Name: "Задние фонари (пара)", Price: "от 2 500 ₽"},
		},
		Gallery: []string{"IMG_1850.webp", "IMG_1848.webp", "IMG_0353.webp", "IMG_0356.webp"},
	},
	{
		Slug:        "coatings",
		Title:       "Защитные покрытия",
		Subtitle:    "Керамика — долговременная защита",
		Description: "Керамическое покрытие для ЛКП. Создаёт устойчивый к химическим воздействиям слой, который защищает автомобиль от загрязнений и повреждений. Также облегчает уход за авто: грязь благодаря покрытию не впитывается, легко смывается.",
		HeroImage:   "IMG_1850.webp",
		Tags:        []string{"Керамика"},
		Steps: []components.Step{
			{Title: "Подготовка ЛКП", Description: "Полировка для идеальной поверхности — покрытие ляжет равномерно"},
			{Title: "Обезжиривание", Description: "Удаление остатков полировальных паст специальным составом"},
			{Title: "Нанесение покрытия", Description: "Нанесение покрытия - Нанесение керамического состава"},
			{Title: "ИК-сушка и полимеризация", Description: "Принудительная сушка инфракрасной лампой для максимальной твёрдости"},
		},
		Prices: []components.Price{
			{Name: "Керамика", Price: "от 20 000 ₽"},
		},
		Gallery: []string{"IMG_1850.webp", "IMG_9888.webp", "IMG_9889.webp", "IMG_7242.webp"},
	},
	{
		Slug:        "cleaning",
		Title:       "Химчистка салона",
		Subtitle:    "Глубокая очистка интерьера автомобиля",
		Description: "Полная химчистка салона: сиденья, потолок, двери, торпедо, багажник. Работаем с кожей, тканью, алькантарой, велюром. Удаляем пятна, запахи, бактерии. Используем профессиональные экстракторы и безопасные составы.",
		HeroImage:   "IMG_6183.webp",
		Tags:        []string{"Полная химчистка", "Потолок", "Сиденья", "Багажник", "Кожа", "Удаление запахов"},
		Steps: []components.Step{
			{Title: "Пылесос и продувка", Description: "Удаление крупного мусора, пыли из всех щелей сжатым воздухом"},
			{Title: "Нанесение составов", Description: "Подбор химии под каждый тип материала, обработка всех поверхностей"},
			{Title: "Экстракция и сушка", Description: "Вытягивание грязи торнадором и экстрактором, сушка с озонированием"},
			{Title: "Консервация", Description: "Защитные составы для кожи и пластика, антистатик для тканей"},
		},
		Prices: []components.Price{
			{Name: "Полная химчистка салона", Price: "от 12 000 ₽"},
			{Name: "Химчистка + озонирование", Price: "от 15 000 ₽"},
		},
		Gallery: []string{"IMG_6183.webp", "IMG_6185.webp", "IMG_6186.webp", "IMG_6187.webp"},
	},
	{
		Slug:        "interior-polishing",
		Title:       "Полировка декоративных вставок",
		Subtitle:    "Восстановление глянца интерьерных элементов",
		Description: "Полировка декоративных вставок салона: лакированные панели, рояльный лак, карбоновые и алюминиевые накладки. Удаляем царапины, потёртости, следы от колец и ключей. Возвращаем заводской глянец.",
		HeroImage:   "IMG_6188.webp",
		Tags:        []string{"Рояльный лак", "Глянцевые панели", "Карбон", "Алюминий", "Удаление царапин"},
		Steps: []components.Step{
			{Title: "Демонтаж элементов", Description: "Аккуратное снятие декоративных панелей и вставок"},
			{Title: "Оценка повреждений", Description: "Определение глубины царапин и подбор абразива"},
			{Title: "Полировка", Description: "Многоэтапная полировка мини-машинкой с мягкими подложками"},
			{Title: "Защита и установка", Description: "Нанесение защитного состава, монтаж элементов обратно"},
		},
		Prices: []components.Price{
			{Name: "Полировка 1 элемента", Price: "от 2 000 ₽"},
			{Name: "Комплекс (все вставки)", Price: "от 8 000 ₽"},
		},
		Gallery: []string{"IMG_6188.webp", "IMG_6189.webp", "IMG_6190.webp", "IMG_6185.webp"},
	},
	{
		Slug:        "partial-cleaning",
		Title:       "Детейлинг мойка подкапотного пространства",
		Subtitle:    "Безопасная и эффективная очистка двигателя и его элементов",
		Description: "Чистим все зоны: крышку двигателя, арки, щитки, радиаторную решётку, труднодоступные узлы. Аккуратно, без лишнего воздействия и с гарантией запуска.",
		HeroImage:   "IMG_6186.webp",
		Tags: []string{"Двигатель", "Моторный отсек", "Радиатор", "Подкапотка", "Электроника", "Патрубки"},		
		Steps: []components.Step{
			{Title: "Осмотр загрязнений", Description: "Оцениваем степень запылённости и маслянистые отложения"},
			{Title: "Защита электроники", Description: "Герметизируем разъёмы, генератор, воздушный фильтр"},
			{Title: "Нанесение состава", Description: "Аккуратное нанесение автохимии под давлением"},
			{Title: "Мойка водой", Description: "Контролируемая подача воды без повреждения проводки"},
			{Title: "Продувка и сушка", Description: "Удаление влаги сжатым воздухом, проверка запуска"},
		},
		Prices: []components.Price{
			{Name: "Мойка двигателя", Price: "от 7 000 ₽"},
		},
		Gallery: []string{"IMG_6186.webp", "IMG_6183.webp", "IMG_6190.webp", "IMG_6189.webp"},
	},
	{
		Slug:        "soundproofing",
		Title:       "Шумоизоляция салона",
		Subtitle:    "Тишина и комфорт в вашем автомобиле",
		Description: "Профессиональная шумоизоляция автомобиля. Обрабатываем пол, двери, крышу, багажник, арки. Используем вибродемпферы, шумопоглотители и теплоизоляцию.",
		HeroImage:   "IMG_7242.webp",
		Tags:        []string{"Полная шумоизоляция", "Двери", "Пол", "Крыша", "Багажник", "Арки колёс"},
		Steps: []components.Step{
			{Title: "Разборка салона", Description: "Полный или частичный демонтаж обшивки и элементов интерьера"},
			{Title: "Подготовка поверхностей", Description: "Очистка и обезжиривание металлических поверхностей"},
			{Title: "Монтаж материалов", Description: "Послойная укладка: вибродемпфер, шумопоглотитель, теплоизоляция"},
			{Title: "Сборка и проверка", Description: "Установка обшивки, проверка креплений и отсутствия скрипов"},
		},
		Prices: []components.Price{
			{Name: "Двери (4 шт)", Price: "от 12 000 ₽"},
			{Name: "Пол", Price: "от 10 000 ₽"},
			{Name: "Крыша", Price: "от 6 000 ₽"},
			{Name: "Полная шумоизоляция", Price: "от 45 000 ₽"},
		},
		Gallery: []string{"IMG_7242.webp", "IMG_7716.webp", "IMG_3592.webp", "IMG_2926.webp"},
	},
}

var casesList = []components.Case{
	{
		Slug:      "BMW",
		Car:       "BMW",
		Title:     "Что было сделанно с машиной",
		HeroImage: "оп7.webp",
		BeforeImg: "оп до.webp",
		AfterImg:  "оп8.webp",
		Works: []components.Step{
			{Title: "Замер толщины ЛКП", Description: "Диагностика толщиномером всех панелей кузова"},
			{Title: "Подготовка", Description: "Тщательная мойка, маскировка пластика и резинок"},
			{Title: "Абразивная полировка", Description: "Удаление глубоких царапин и голограмм роторной машинкой"},
			{Title: "Финишная полировка", Description: "Придание идеального глянца DA-машинкой"},
			{Title: "Керамическое покрытие", Description: "Нанесение 2 слоёв керамики с ИК-сушкой"},
		},
		Gallery: []string{"оп5.webp"},
	},
	{
		Slug:      "dodge-ram",
		Car:       "Dodge RAM",
		Title:     "Что было сделанно с машиной",
		HeroImage: "IMG_0243.webp",
		BeforeImg: "FullSizeRender 21.webp",
		AfterImg:  "FullSizeRender 11.webp",
		Works: []components.Step{
			{Title: "Замер толщины ЛКП", Description: "Диагностика толщиномером всех панелей кузова"},
			{Title: "Подготовка", Description: "Тщательная мойка и маскировка пластика и резинок"},
			{Title: "Абразивная полировка", Description: "Удаление глубоких царапин и голограмм роторной машинкой"},
			{Title: "Финишная полировка", Description: "Придание идеального глянца DA-машинкой"},
			{Title: "Керамическое покрытие", Description: "Нанесение 2 слоёв керамики с ИК-сушкой"},
		},
		Gallery: []string{"IMG_0243.webp"},
	},
	{
		Slug:      "LEXUS",
		Car:       "LEXUS",
		Title:     "Что было сделанно с машиной",
		HeroImage: "цп3.webp",
		BeforeImg: "цп2.webp",
		AfterImg:  "цп.webp",
		Works: []components.Step{
			{Title: "Замер толщины ЛКП", Description: "Диагностика толщиномером всех панелей кузова"},
			{Title: "Подготовка", Description: "Тщательная мойка, маскировка пластика и резинок"},
			{Title: "Абразивная полировка", Description: "Удаление глубоких царапин и голограмм роторной машинкой"},
			{Title: "Финишная полировка", Description: "Придание идеального глянца DA-машинкой"},
			{Title: "Керамическое покрытие", Description: "Нанесение 2 слоёв керамики с ИК-сушкой"},
		},
		Gallery: []string{"цп5.webp"},
	},
}

var servicesMap map[string]*components.Service
var casesMap map[string]*components.Case

func init() {
	servicesMap = make(map[string]*components.Service, len(servicesList))
	for i := range servicesList {
		servicesMap[servicesList[i].Slug] = &servicesList[i]
	}
	casesMap = make(map[string]*components.Case, len(casesList))
	for i := range casesList {
		casesMap[casesList[i].Slug] = &casesList[i]
	}
}

// ============================
// API Types
// ============================

type Analytics struct {
	Sections   []string `json:"sections"`
	Tabs       []string `json:"tabs"`
	TimeOnSite float64  `json:"timeOnSite"`
}

type BookingRequest struct {
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Car       string    `json:"car"`
	Service   string    `json:"service"`
	Comment   string    `json:"comment"`
	Analytics Analytics `json:"analytics"`
}

type TelegramMessage struct {
	ChatID    string `json:"chat_id"`
	Text      string `json:"text"`
	ParseMode string `json:"parse_mode"`
}

var (
	botToken string
	chatID   string
)

func main() {
	botToken = os.Getenv("BOT_TOKEN")
	chatID = os.Getenv("CHAT_ID")
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()

	// Pages
	mux.HandleFunc("GET /{$}", handleIndex)
	mux.HandleFunc("GET /about", handleAbout)
	mux.HandleFunc("GET /services/{slug}", handleService)
	mux.HandleFunc("GET /cases/{slug}", handleCase)

	// API
	mux.HandleFunc("POST /api/booking", handleBooking)

	// Static files
	fs := http.FileServer(http.Dir("static"))
	mux.Handle("GET /static/", http.StripPrefix("/static/", fs))

	log.Printf("Server starting on :%s", port)
	if botToken == "" || chatID == "" {
		log.Println("WARNING: BOT_TOKEN or CHAT_ID not set. Bookings will be logged only.")
	}

	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

// ============================
// Page Handlers
// ============================

func handleIndex(w http.ResponseWriter, r *http.Request) {
	components.IndexPage(servicesList, casesList).Render(r.Context(), w)
}

func handleAbout(w http.ResponseWriter, r *http.Request) {
	components.AboutPage(servicesList).Render(r.Context(), w)
}

func handleService(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	svc, ok := servicesMap[slug]
	if !ok {
		http.NotFound(w, r)
		return
	}
	components.ServicePage(*svc, servicesList).Render(r.Context(), w)
}

func handleCase(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	c, ok := casesMap[slug]
	if !ok {
		http.NotFound(w, r)
		return
	}
	components.CasePage(*c, casesList, servicesList).Render(r.Context(), w)
}

// ============================
// Booking API
// ============================

func handleBooking(w http.ResponseWriter, r *http.Request) {
	var req BookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Phone = strings.TrimSpace(req.Phone)

	if req.Name == "" || req.Phone == "" {
		http.Error(w, `{"error":"name and phone are required"}`, http.StatusBadRequest)
		return
	}

	message := formatMessage(req)
	log.Printf("New booking:\n%s", message)

	if botToken != "" && chatID != "" {
		if err := sendTelegram(message); err != nil {
			log.Printf("Failed to send to Telegram: %v", err)
			http.Error(w, `{"error":"failed to send notification"}`, http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}

func formatMessage(req BookingRequest) string {
	var b strings.Builder
	fmt.Fprintf(&b, "🚗 <b>Новая заявка с сайта!</b>\n\n")
	fmt.Fprintf(&b, "👤 Имя: %s\n", req.Name)
	fmt.Fprintf(&b, "📞 Телефон: %s\n", req.Phone)
	if req.Car != "" {
		fmt.Fprintf(&b, "🚙 Автомобиль: %s\n", req.Car)
	}
	if req.Service != "" {
		fmt.Fprintf(&b, "🔧 Услуга: %s\n", req.Service)
	}
	if req.Comment != "" {
		fmt.Fprintf(&b, "💬 Комментарий: %s\n", req.Comment)
	}
	b.WriteString("\n─────────────────\n")
	if len(req.Analytics.Sections) > 0 {
		fmt.Fprintf(&b, "📊 Секции: %s\n", strings.Join(req.Analytics.Sections, ", "))
	}
	if len(req.Analytics.Tabs) > 0 {
		fmt.Fprintf(&b, "🔖 Табы: %s\n", strings.Join(req.Analytics.Tabs, ", "))
	}
	if req.Analytics.TimeOnSite > 0 {
		minutes := int(req.Analytics.TimeOnSite) / 60
		seconds := int(req.Analytics.TimeOnSite) % 60
		fmt.Fprintf(&b, "⏱ Время на сайте: %d мин %d сек\n", minutes, seconds)
	}
	return b.String()
}

func sendTelegram(text string) error {
	msg := TelegramMessage{ChatID: chatID, Text: text, ParseMode: "HTML"}
	body, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("post: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("telegram status %d", resp.StatusCode)
	}
	return nil
}
