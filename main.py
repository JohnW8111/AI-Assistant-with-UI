# I wrote this on replit and the only libraries I installed were openai and replit
import os
import time
from openai import OpenAI
import json  # Used for handling JSON data
from flask import Flask,  request, redirect, url_for

#You need an API key from OpenAI to use this.
#You can get one here: https://platform.openai.com/account/api-keys
client = OpenAI(
    api_key=os.environ['OPENAI_API_KEY'],
)

# You are going to create an assistant on open AI. 
# You can go here to create an assistant: https://platform.openai.com/assistants
# You can use this to test your assistant: https://platform.openai.com/playground
# Once you create your assistan entere the id on this line of code.
assistant_id =os.environ['ASST_ID']


# You can find out more about assitant and the following four subroutines:https://cookbook.openai.com/examples/assistants_api_overview_python
def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )


def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")


def create_thread_and_run(user_input):
  thread = client.beta.threads.create()
  run = submit_message(assistant_id, thread, user_input)
  return thread, run


# Waiting in a loop
def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run



# all of the folloing code is to create a flask app that will allow you to interact with your assistant.
app = Flask(__name__, static_folder='static')
            
@app.route('/')
def index():
    page=""
    f = open("templates/index.html", "r")
    page = f.read()
    f.close()
    return page

@app.route("/chat" , methods=["POST"])
def chat():
    thread1, run1 = create_thread_and_run(request.form["question"])
    run1 = wait_on_run(run1, thread1)
    messages = get_response(thread1)

    # Format messages as JSON
    messages_json = [{"role": m.role, "content": m.content[0].text.value} for m in messages.data]
   
    return (messages_json)
  
app.run(host='0.0.0.0', port=81)
