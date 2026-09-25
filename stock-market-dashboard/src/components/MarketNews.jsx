import { ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MarketNews() {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://equix-backend.onrender.com";

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/news`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setNews(data.news || []);
        }
      } catch (error) {
        console.error(
          "Market news loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatTime = (date) => {
    if (!date) return "Recently";

    const newsDate = new Date(date);

    if (Number.isNaN(newsDate.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const difference =
      Math.floor(
        (now.getTime() -
          newsDate.getTime()) /
          60000
      );

    if (difference < 1) {
      return "Just now";
    }

    if (difference < 60) {
      return `${difference} min ago`;
    }

    const hours = Math.floor(
      difference / 60
    );

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  };

  return (
    <div className="news-card">

      <div className="section-title">

        <div>
          <h2>Market News</h2>

          <p>
            Latest financial updates
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/learn")
          }
        >
          See all
          <ArrowUpRight size={14} />
        </button>

      </div>

      <div className="news-list">

        {loading && (
          <div className="news-loading">
            Loading latest news...
          </div>
        )}

        {!loading &&
          news.length === 0 && (
            <div className="news-empty">
              No market news available
            </div>
          )}

        {!loading &&
          news.map((item, index) => (
            <div
              className="news-item"
              key={
                item.id ||
                item.url ||
                index
              }
            >

              <div className="news-number">
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="news-content">

                <h3>
                  {item.title}
                </h3>

                <div className="news-meta">

                  <span>
                    {item.source ||
                      "Market News"}
                  </span>

                  <span className="news-time">

                    <Clock size={11} />

                    {formatTime(
                      item.publishedAt
                    )}

                  </span>

                </div>

              </div>

              <span className="news-tag">
                {item.tag ||
                  "Markets"}
              </span>

            </div>
          ))}

      </div>

    </div>
  );
}

export default MarketNews;