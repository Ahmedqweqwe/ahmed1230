    document.addEventListener("DOMContentLoaded", function() {
      // 1. Dark Mode setup
      const darkToggle = document.getElementById("dark-toggle");
      const savedTheme = localStorage.getItem("theme");

      // Set default theme from localStorage
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if(darkToggle) darkToggle.innerHTML = "<i class='fa fa-sun'></i>";
      }

      if (darkToggle) {
        darkToggle.addEventListener("click", function() {
          document.body.classList.toggle("dark-mode");
          if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            darkToggle.innerHTML = "<i class='fa fa-sun'></i>";
          } else {
            localStorage.setItem("theme", "light");
            darkToggle.innerHTML = "<i class='fa fa-moon'></i>";
          }
        });
      }

      // 2. Back to top button visibility scroll trigger
      const bttBtn = document.getElementById("back-to-top-btn");
      window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
          bttBtn.style.display = "flex";
        } else {
          bttBtn.style.display = "none";
        }
      });
      if (bttBtn) {
        bttBtn.addEventListener("click", function() {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      // 3. Auto Table of Contents generator
      const postBody = document.getElementById("post-body-text");
      const tocUl = document.getElementById("toc-list-ul");
      const tocWrap = document.getElementById("toc-wrapper");
      const tocToggle = document.getElementById("toc-toggle-btn");

      if (postBody && tocUl) {
        const headings = postBody.querySelectorAll("h2, h3");
        if (headings.length > 0) {
          headings.forEach(function(heading, index) {
            const headingId = "toc-heading-" + index;
            heading.setAttribute("id", headingId);

            const li = document.createElement("li");
            li.style.paddingRight = heading.tagName === "H3" ? "15px" : "0px";
            
            const link = document.createElement("a");
            link.setAttribute("href", "#" + headingId);
            link.textContent = heading.textContent;
            link.style.color = "var(--text-color)";
            
            li.appendChild(link);
            tocUl.appendChild(li);
          });

          // Toc Toggle collapsible behavior
          if (tocToggle) {
            tocToggle.addEventListener("click", function() {
              if (tocUl.style.display === "none") {
                tocUl.style.display = "block";
                tocToggle.querySelector(".fa-chevron-down").style.transform = "rotate(0deg)";
              } else {
                tocUl.style.display = "none";
                tocToggle.querySelector(".fa-chevron-down").style.transform = "rotate(180deg)";
              }
            });
          }
        } else {
          // Hide table of contents block if no headers found
          if (tocWrap) tocWrap.style.display = "none";
        }
      }

      // 4. Tabbed Comment Panels
      const bloggerTab = document.getElementById("blogger-tab");
      const fbTab = document.getElementById("facebook-tab");
      const bloggerPanel = document.getElementById("blogger-panel");
      const fbPanel = document.getElementById("facebook-panel");

      if (bloggerTab && fbTab && bloggerPanel && fbPanel) {
        bloggerTab.addEventListener("click", function() {
          bloggerTab.classList.add("active");
          fbTab.classList.remove("active");
          bloggerPanel.classList.add("active");
          fbPanel.classList.remove("active");
        });
        fbTab.addEventListener("click", function() {
          fbTab.classList.add("active");
          bloggerTab.classList.remove("active");
          fbPanel.classList.add("active");
          bloggerPanel.classList.remove("active");
        });
      }

      // 5. AJAX Search Mock Bar Setup
      const searchBox = document.getElementById("search-box");
      const searchResults = document.getElementById("search-results");

      if (searchBox && searchResults) {
        searchBox.addEventListener("input", function() {
          const query = searchBox.value.trim().toLowerCase();
          if (query.length < 2) {
            searchResults.style.display = "none";
            searchResults.innerHTML = "";
            return;
          }

          // Fetch Blogger posts feeds (Mocking AJAX database searching in feed for dynamic preview)
          // Real Blogger searches will query "/feeds/posts/summary?q=query"
          searchResults.style.display = "block";
          searchResults.innerHTML = "<div style='padding: 10px; text-align: center; font-size:12px;'><i class='fa-solid fa-spinner fa-spin'></i> جاري البحث التلقائي ومزامنة البيانات...</div>";

          // Simulate real search outputs dynamically
          setTimeout(function() {
            // Find matched posts (can represent actual searching if this was connected to live Blogger APIs)
            searchResults.innerHTML = "";
            const matches = [
              { title: "أفضل 5 طرق لتسريع موقع بلوجر تماماً لعام 2026", url: "#", date: "4 يونيو 2026", cat: "بلوجر" },
              { title: "دليلك الشامل لتعلم السيو وفهم بنية محرك بحث جوجل الجديدة", url: "#", date: "1 يونيو 2026", cat: "تصميم" },
              { title: "كيفية دمج وتثبيت شريط الإعلانات بمختلف مناطق القوالب", url: "#", date: "24 مايو 2026", cat: "تحسين سيو" }
            ].filter(p => p.title.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query));

            if (matches.length > 0) {
              matches.forEach(item => {
                const div = document.createElement("div");
                div.style.padding = "10px";
                div.style.borderBottom = "1px solid var(--border-color)";
                div.style.fontSize = "12px";
                div.innerHTML = "<a href='" + item.url + "' style='font-weight: 700; color: var(--text-color); display:block;'>" + item.title + "</a><span style='color:#a0aec0; font-size:10px;'>" + item.cat + " • " + item.date + "</span>";
                searchResults.appendChild(div);
              });
            } else {
              searchResults.innerHTML = "<div style='padding: 12px; text-align:center; color:#a0aec0; font-size:12px;'>عذراً، لم نجد نتائج مخصصة لـ '" + query + "'. استكشف تصنيفات أخرى!</div>";
            }
          }, 400);
        });

        // Close search list on clicking outside
        document.addEventListener("click", function(event) {
          if (!searchBox.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
          }
        });
      }

      // 6. Copy URL link utility helper
      const copyBtn = document.getElementById("copy-link-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", function() {
          const urlLink = copyBtn.getAttribute("data-url") || window.location.href;
          navigator.clipboard.writeText(urlLink).then(function() {
            alert("تم نسخ رابط المقال بنجاح إلى الحافظة للتبادل!");
          });
        });
      }

      // 7. Auto copyright year
      const copyrightYear = document.getElementById("copyright-year");
      if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear().toString();
      }
    });
