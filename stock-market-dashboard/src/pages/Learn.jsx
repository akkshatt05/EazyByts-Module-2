import {
  Search,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Clock3,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";

const categories = [
  "All",
  "Beginner",
  "Investing",
  "Trading",
  "Risk Management",
];

const learningResources = [
  {
    id: 1,
    title: "Stock Market Basics",
    description:
      "Learn how the stock market works and understand essential investing concepts.",
    category: "Beginner",
    level: "Beginner",
    duration: "15 min",
    icon: BookOpen,
    progress: 65,
  },
  {
    id: 2,
    title: "Understanding Market Trends",
    description:
      "Understand market movements, trends, and the factors that influence stock prices.",
    category: "Investing",
    level: "Intermediate",
    duration: "20 min",
    icon: TrendingUp,
    progress: 40,
  },
  {
    id: 3,
    title: "Risk Management",
    description:
      "Learn how to manage investment risk and protect your portfolio from large losses.",
    category: "Risk Management",
    level: "Intermediate",
    duration: "18 min",
    icon: ShieldCheck,
    progress: 20,
  },
  {
    id: 4,
    title: "Portfolio Diversification",
    description:
      "Discover how diversification can help balance risk across different investments.",
    category: "Investing",
    level: "Beginner",
    duration: "12 min",
    icon: PieChart,
    progress: 80,
  },
  {
    id: 5,
    title: "Trading Fundamentals",
    description:
      "Explore the basics of buying, selling, orders, and trading strategies.",
    category: "Trading",
    level: "Intermediate",
    duration: "25 min",
    icon: TrendingUp,
    progress: 35,
  },
  {
    id: 6,
    title: "Building Your First Portfolio",
    description:
      "Learn how to create a balanced portfolio based on your financial goals.",
    category: "Beginner",
    level: "Beginner",
    duration: "22 min",
    icon: PieChart,
    progress: 10,
  },
];

function Learn() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");

  const filteredResources = learningResources.filter(
    (resource) => {
      const matchesSearch =
        resource.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        resource.category === activeCategory;

      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="learn-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Learn</h1>

          <p>
            Build your investing knowledge and make
            smarter decisions.
          </p>
        </div>

        <div className="learn-progress">
          <BookOpen size={15} />

          <span>3 of 12 completed</span>
        </div>
      </div>

      {/* =========================
          FEATURED RESOURCE
      ========================= */}

      <div className="learn-featured">
        <div className="featured-content">
          <span className="featured-label">
            FEATURED COURSE
          </span>

          <h2>
            Master the Basics of Investing
          </h2>

          <p>
            Start your investment journey by
            understanding stocks, markets, risk,
            diversification, and portfolio management.
          </p>

          <button className="start-learning-button">
            Continue Learning
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="featured-icon">
          <TrendingUp size={70} strokeWidth={1.2} />
        </div>
      </div>

      {/* =========================
          SEARCH & CATEGORIES
      ========================= */}

      <div className="learn-toolbar">
        <div className="learn-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search learning resources..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="learn-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? "active-category"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          LEARNING RESOURCES
      ========================= */}

      <div className="learn-section-header">
        <div>
          <h3>Learning Resources</h3>

          <p>
            Explore topics and improve your market
            knowledge.
          </p>
        </div>

        <span>
          {filteredResources.length} Resources
        </span>
      </div>

      <div className="learning-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => {
            const Icon = resource.icon;

            return (
              <div
                className="learning-card"
                key={resource.id}
              >
                <div className="learning-card-top">
                  <div className="learning-icon">
                    <Icon size={19} />
                  </div>

                  <span className="learning-level">
                    {resource.level}
                  </span>
                </div>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <div className="learning-meta">
                  <span>
                    <Clock3 size={12} />
                    {resource.duration}
                  </span>

                  <span>
                    <PlayCircle size={12} />
                    Lesson
                  </span>
                </div>

                <div className="learning-progress">
                  <div className="learning-progress-info">
                    <span>Progress</span>

                    <strong>
                      {resource.progress}%
                    </strong>
                  </div>

                  <div className="learning-progress-bar">
                    <div
                      style={{
                        width: `${resource.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <button className="open-lesson-button">
                  {resource.progress > 0
                    ? "Continue"
                    : "Start Lesson"}

                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty-learning">
            <BookOpen size={28} />

            <strong>
              No learning resources found
            </strong>

            <span>
              Try searching for another topic.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learn;