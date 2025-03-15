
// This file is for basic JavaScript functionality

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons && tabPanes) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Hide all panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Show selected pane
                if (tabId && document.getElementById(`${tabId}-tab`)) {
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                }
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
});

// Survey form functionality
function updateHiddenField(input, targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.value = input.value;
    }
}

function updateQuestionType(select, index) {
    const questionContainer = select.closest('.question-item');
    const optionsContainer = questionContainer.querySelector('.options-container');
    const typeHiddenInput = document.getElementById(`Questions_${index}__Type`);
    
    if (typeHiddenInput) {
        typeHiddenInput.value = select.value;
    }
    
    if (optionsContainer) {
        if (select.value === 'Text' || select.value === 'Rating') {
            optionsContainer.classList.add('hidden');
        } else {
            optionsContainer.classList.remove('hidden');
        }
    }
}

function updateRequiredField(checkbox, index) {
    const requiredInput = document.getElementById(`Questions_${index}__Required`);
    if (requiredInput) {
        requiredInput.value = checkbox.checked.toString().toLowerCase();
    }
}

function updateOptionValue(input, questionIndex, optionIndex) {
    const optionInput = document.querySelector(`input[name="Questions[${questionIndex}].Options[${optionIndex}]"]`);
    if (optionInput) {
        optionInput.value = input.value;
    }
}

// Add option to question
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-option')) {
        const questionItem = e.target.closest('.question-item');
        const optionsList = questionItem.querySelector('.options-list');
        const questionIndex = questionItem.getAttribute('data-index');
        
        const optionsCount = optionsList.children.length;
        const optionHtml = `
            <div class="flex items-center">
                <input type="hidden" name="Questions[${questionIndex}].Options[${optionsCount}]" value="New Option" />
                <input type="text" class="option-input flex-1 px-3 py-1 border border-gray-300 rounded-md"
                       value="New Option"
                       onchange="updateOptionValue(this, ${questionIndex}, ${optionsCount})" />
                <button type="button" class="remove-option ml-2 text-red-500">×</button>
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = optionHtml;
        optionsList.appendChild(tempDiv.firstElementChild);
    }
});

// Remove option from question
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-option')) {
        const questionItem = e.target.closest('.question-item');
        const optionsList = questionItem.querySelector('.options-list');
        
        if (optionsList.children.length > 2) {
            const optionItem = e.target.closest('.flex');
            optionItem.remove();
        }
    }
});
