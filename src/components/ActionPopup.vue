<template>
	<div class="action-popup">
		<n-modal preset="dialog" :show="popupState.show" @hide="closePopup">
			<template #header> </template>
			<div>{{ texts[popupState.action - 1] }}</div>
			<div v-if="popupState.action !== 4">
				<n-input
					type="text"
					v-model:value="filename"
					placeholder="Введите название"
				/>
			</div>
			<template #action>
				<n-button type="primary" ghost @click="updateHierarchyTree">
					Ок
				</n-button>
				<n-button type="error" ghost @click="closePopup"> Отмена </n-button>
			</template>
		</n-modal>
	</div>
</template>

<script setup>
import { NButton, NInput, NModal } from 'naive-ui'
import { defineEmits, defineProps, ref, watch } from 'vue'

const texts = ['Создать файл', 'Создать папку', 'Переименование', 'Вы уверены?']

const props = defineProps({
	popupState: {
		type: Object,
		required: true,
	},
	oldFilename: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(['update:popup-state', 'update:hierarchy-tree'])

const filename = ref('')

const closePopup = () => {
	emit('update:popup-state', false, 1)
}

const updateHierarchyTree = () => {
	if (filename.value.length > 0 || props.popupState.action === 4) {
		emit('update:hierarchy-tree', filename.value)

		closePopup()
	}
}

//сбрасываем название элемента если это не переименование
watch(
	() => props.popupState.show,
	() => {
		if (props.popupState.action !== 3) {
			filename.value = ''
			return
		}

		filename.value = props.oldFilename
	}
)
</script>
