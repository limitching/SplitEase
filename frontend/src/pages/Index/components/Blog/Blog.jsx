/* eslint-disable jsx-a11y/anchor-is-valid */
import "./blog.css";
const Blog = () => {
  return (
    <section id="blog" className="blog-area pt-120" style={{ position: "relative", zIndex: "5" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="section-title pb-35">
              <div className="line"></div>
              <h3 className="title">
                <span>Our Recent</span> Blog Posts
              </h3>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-7">
            <div className="single-blog mt-30 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
              <div className="blog-image">
                <img src="assets/images/blog-2.jpg" alt="blog" />
              </div>
              <div className="blog-content">
                <ul className="meta" style={{ paddingLeft: "0" }}>
                  <li>
                    Posted By:{" "}
                    <a href="https://github.com/limitching/" target="_blank" rel="noopener noreferrer">
                      Hung WEI-CHING
                    </a>
                  </li>
                  <li>03 June, 2023</li>
                </ul>
                <p className="text">
                  <strong>Readme</strong>
                  <br></br>A Readme for SplitEase Project
                </p>
                <a
                  className="more"
                  href="https://github.com/limitching/SplitEase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More <i className="lni-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-7">
            <div className="single-blog mt-30 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
              <div className="blog-image">
                <img src="assets/images/blog-1.jpg" alt="blog" />
              </div>
              <div className="blog-content">
                <ul className="meta" style={{ paddingLeft: "0" }}>
                  <li>
                    Posted By:{" "}
                    <a href="https://github.com/limitching/" target="_blank" rel="noopener noreferrer">
                      Hung WEI-CHING
                    </a>
                  </li>
                  <li>03 June, 2023</li>
                </ul>
                <p className="text">
                  <strong>SplitEase System Design</strong>
                  <br></br>Back-End Web Architecture Under Hood
                </p>

                <a
                  className="more"
                  href="https://github.com/limitching/SplitEase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More <i className="lni-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-7">
            <div className="single-blog mt-30 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
              <div className="blog-image">
                <img src="assets/images/blog-3.jpg" alt="blog" />
              </div>
              <div className="blog-content">
                <ul className="meta" style={{ paddingLeft: "0" }}>
                  <li>
                    Posted By:{" "}
                    <a href="https://github.com/limitching/" target="_blank" rel="noopener noreferrer">
                      Hung WEI-CHING
                    </a>
                  </li>
                  <li>03 June, 2023</li>
                </ul>
                <p className="text">
                  <strong>SplitEase System Design</strong>
                  <br></br>
                  Find PerformanceBottlenecks
                </p>
                <a
                  className="more"
                  href="https://github.com/limitching/SplitEase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More <i className="lni-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
