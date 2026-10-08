# TEMO water effects — offline interactive preview
No production deployment is performed by this workflow.

1. On the draft PR, open the **TEMO Offline Preview Package** GitHub Actions run.
2. Under Artifacts download `temo-water-offline-preview` and extract the artifact archive.
3. Extract the inner `temo-water-offline-preview.zip` into a new folder.
4. In that folder run `python3 -m http.server 8767` on a computer with Python 3.
5. Open `http://localhost:8767/index.html` to inspect Home, About, Products and Contact.
6. On a phone on the same trusted Wi-Fi network, connect to the computer's LAN IP and port 8767, after configuring the firewall appropriately. Never expose the test server publicly.
7. Do not submit real contact inquiries from the preview. Forms have external endpoints; automated tests intercept email requests, but this manual preview does not.
8. Production approval is a separate explicit step. The PR must remain draft until approved.

Note: Downloading the archive alone is not a Cloudflare preview or proof that backend services work. Absolute URL assets may require a local HTTP server.
