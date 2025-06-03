const shortenBtn = document.getElementById('shorten-btn');
const shortUrlDiv = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const errorDiv = document.getElementById('error');
const spinner = document.getElementById('spinner');

shortenBtn.addEventListener('click', async () => {
  shortUrlDiv.textContent = '';
  errorDiv.textContent = '';
  copyBtn.style.display = 'none';
  spinner.style.display = 'block';

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let url = tab.url;

    if (!url.startsWith('http')) {
      errorDiv.textContent = "Invalid URL.";
      spinner.style.display = 'none';
      return;
    }

    let api = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`;
    let response = await fetch(api);
    if (!response.ok) {
      errorDiv.textContent = "Failed to connect to TinyURL.";
      spinner.style.display = 'none';
      return;
    }
    let shortUrl = await response.text();

    if (!shortUrl.startsWith('http')) {
      errorDiv.textContent = "Failed to shorten URL.";
      spinner.style.display = 'none';
      return;
    }

    shortUrlDiv.textContent = shortUrl;
    copyBtn.style.display = 'inline-block';
    spinner.style.display = 'none';

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(shortUrl);
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove('copied');
      }, 1500);
    };
  } catch (err) {
    errorDiv.textContent = "Error: " + err.message;
    spinner.style.display = 'none';
  }
});
