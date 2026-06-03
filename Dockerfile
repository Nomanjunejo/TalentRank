FROM python:3.10-slim

# Set up a new user named "user" with user ID 1000 for Hugging Face security
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements and install them under the user path
COPY --chown=user ./requirements.txt $HOME/app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r $HOME/app/requirements.txt

# Copy all the backend folder contents and ensure ownership is set to 'user'
COPY --chown=user . $HOME/app

# Hugging Face requires port 7860
ENV PORT=7860
EXPOSE 7860

# Run Uvicorn pointing to main app inside the 'app' module
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]